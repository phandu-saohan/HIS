import React, { useState, useRef, useEffect, useMemo } from 'react';
import { type TelemedicineSession } from '../types';

interface TelemedicineProps {
    sessions: TelemedicineSession[];
    onUpdateSession: (session: TelemedicineSession) => void;
}

const AGORA_APP_ID = 'bf0b68bf788e4c2e9d1c6c56fedcb3dc';
// Make AgoraRTC available from the script tag
declare const AgoraRTC: any;


// --- Call View Sub-component ---
interface CallViewProps {
    session: TelemedicineSession;
    onEndCall: () => void;
}
const CallView: React.FC<CallViewProps> = ({ session, onEndCall }) => {
    const client = useRef<any>(null);
    const localTracks = useRef<{ audio: any, video: any }>({ audio: null, video: null });
    
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [remoteUser, setRemoteUser] = useState<any>(null);
    const [hasVideo, setHasVideo] = useState(true);

    useEffect(() => {
        // Initialize client
        client.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

        const handleUserPublished = async (user: any, mediaType: 'video' | 'audio') => {
            await client.current.subscribe(user, mediaType);
            if (mediaType === 'video') {
                setRemoteUser(user);
                // Allow a moment for the DOM to update before playing
                setTimeout(() => user.videoTrack.play(`remote-video-player`), 0);
            }
            if (mediaType === 'audio') {
                user.audioTrack.play();
            }
        };

        const handleUserLeft = (user: any) => {
            if (user.uid === remoteUser?.uid) {
                setRemoteUser(null);
            }
        };

        client.current.on('user-published', handleUserPublished);
        client.current.on('user-left', handleUserLeft);
        
        const joinChannel = async () => {
            try {
                await client.current.join(AGORA_APP_ID, session.id, null, null);

                const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                localTracks.current.audio = audioTrack;

                try {
                    const videoTrack = await AgoraRTC.createCameraVideoTrack();
                    localTracks.current.video = videoTrack;
                    setHasVideo(true);
                } catch (videoError: any) {
                    if (videoError.name === 'NotFoundError') {
                         console.warn("Không tìm thấy camera. Giao diện cuộc gọi sẽ hiển thị một trình giữ chỗ.");
                    } else {
                        console.error("Lỗi khi truy cập camera:", videoError);
                    }
                    setHasVideo(false);
                }
                
                const tracksToPublish = Object.values(localTracks.current).filter(Boolean);
                if (tracksToPublish.length > 0) {
                    await client.current.publish(tracksToPublish);
                }
                
                if (localTracks.current.video) {
                    localTracks.current.video.play('local-video-player');
                }
            } catch (error) {
                console.error('Không thể tham gia kênh Agora:', error);
                // Optionally call onEndCall() here to close the view on error
            }
        };

        joinChannel();

        return () => {
            localTracks.current.audio?.stop();
            localTracks.current.audio?.close();
            localTracks.current.video?.stop();
            localTracks.current.video?.close();
            client.current?.leave();
        };
    }, [session.id]);
    
    const toggleAudio = () => {
        if (localTracks.current.audio) {
            localTracks.current.audio.setEnabled(!isMuted);
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localTracks.current.video) {
            localTracks.current.video.setEnabled(!isVideoOff);
            setIsVideoOff(!isVideoOff);
        }
    };
    
    return (
        <div className="bg-gray-900 text-white h-full w-full flex flex-col p-4 rounded-xl shadow-2xl relative">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Cuộc gọi với {session.patientName}</h2>
                        <p className="text-sm text-gray-300">Bác sĩ: {session.doctorName}</p>
                    </div>
                </div>
            </div>

            {/* Video Feeds Container */}
            <div className="flex-1 my-4 relative rounded-lg overflow-hidden">
                {/* Remote Video */}
                <div id="remote-video-player" className="w-full h-full object-cover bg-black flex items-center justify-center">
                    {!remoteUser && (
                        <div className="text-center text-gray-400">
                           <UserGroupIcon className="w-16 h-16 mx-auto opacity-50" />
                           <p className="mt-2 font-semibold">Đang chờ bệnh nhân tham gia...</p>
                        </div>
                    )}
                </div>
                
                {/* Local Video */}
                <div id="local-video-player" className="absolute bottom-24 right-6 w-1/4 max-w-[200px] h-auto aspect-video rounded-lg shadow-lg border-2 border-gray-600 bg-black flex items-center justify-center overflow-hidden z-20">
                    {(!hasVideo || isVideoOff) && <VideoOffIcon className="w-8 h-8 text-gray-400 opacity-50" />}
                </div>
                
                {/* Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-sm flex justify-center items-center space-x-6 z-30">
                    <button onClick={toggleAudio} className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        {isMuted ? <MicOffIcon/> : <MicIcon />}
                    </button>
                     <button onClick={toggleVideo} disabled={!hasVideo} className={`p-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isVideoOff ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        {isVideoOff ? <VideoOffIcon /> : <VideoOnIcon />}
                    </button>
                    <button onClick={onEndCall} className="p-4 bg-red-600 hover:bg-red-700 rounded-full scale-110 mx-2">
                        <EndCallIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};


const Telemedicine: React.FC<TelemedicineProps> = ({ sessions, onUpdateSession }) => {
    const [isCallActive, setIsCallActive] = useState(false);
    const [activeSession, setActiveSession] = useState<TelemedicineSession | null>(null);

    const upcomingSessions = useMemo(() => sessions.filter(s => s.status === 'Sắp diễn ra'), [sessions]);
    const historySessions = useMemo(() => sessions.filter(s => s.status !== 'Sắp diễn ra'), [sessions]);

    const handleStartCall = (session: TelemedicineSession) => {
        setActiveSession(session);
        setIsCallActive(true);
    };

    const handleEndCall = () => {
        setIsCallActive(false);
        if (activeSession) {
            onUpdateSession({ ...activeSession, status: 'Đã hoàn thành' });
        }
        setActiveSession(null);
    };

    const getStatusClass = (status: TelemedicineSession['status']) => {
        switch (status) {
            case 'Đã hoàn thành': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Sắp diễn ra': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Đã hủy': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    }

    if (isCallActive && activeSession) {
        return <CallView session={activeSession} onEndCall={handleEndCall} />
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Y tế từ xa (Telemedicine)</h2>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
                <h3 className="text-lg font-bold mb-4">Lịch khám Hôm nay</h3>
                <div className="space-y-4">
                    {upcomingSessions.map(session => (
                        <div key={session.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-bold">{session.startTime} - {session.patientName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Bác sĩ: {session.doctorName}</p>
                            </div>
                            <button onClick={() => handleStartCall(session)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                                <VideoCameraIcon />
                                <span className="ml-2">Bắt đầu</span>
                            </button>
                        </div>
                    ))}
                    {upcomingSessions.length === 0 && <p className="text-gray-500 dark:text-gray-400">Không có lịch khám từ xa nào hôm nay.</p>}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold mb-4">Lịch sử Cuộc gọi</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Bệnh nhân</th>
                                <th scope="col" className="px-6 py-3">Bác sĩ</th>
                                <th scope="col" className="px-6 py-3">Thời gian</th>
                                <th scope="col" className="px-6 py-3">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historySessions.map(call => (
                                <tr key={call.id} className="border-b dark:border-gray-700">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{call.patientName}</td>
                                    <td className="px-6 py-4">{call.doctorName}</td>
                                    <td className="px-6 py-4">{call.startTime}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(call.status)}`}>
                                            {call.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// Icons
const VideoCameraIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const MicIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const MicOffIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m13.37-5.37a13.91 13.91 0 01-12.74 0M12 21v-4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3zM3 3l18 18" /></svg>;
const VideoOnIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const VideoOffIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.52 11.23a1 1 0 00-1.04 1.63l2.2 2.2a1 1 0 001.04-1.63l-2.2-2.2zM2 4.77L4.77 2 21 18.23 18.23 21 2 4.77zm13 5.23l4.55-2.27a1 1 0 011.45.9v6.76a1 1 0 01-1.45.9l-4.55-2.27M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const EndCallIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.78 12.38c-0.12-0.12-0.26-0.21-0.41-0.28-1.55-0.7-3.19-1.07-4.88-1.07-1.69 0-3.33 0.37-4.88 1.07-0.15 0.07-0.29 0.16-0.41 0.28-1.01 1.01-1.28 2.5-0.78 3.82 0.44 1.18 1.25 2.3 2.34 3.28 1.55 1.39 3.4 2.02 5.25 2.02s3.7-0.63 5.25-2.02c1.09-0.98 1.9-2.1 2.34-3.28 0.5-1.32 0.23-2.81-0.78-3.82z" /></svg>;
const UserGroupIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.284-2.72a3 3 0 0 0-4.682-2.72m-3.09 5.438a9.093 9.093 0 0 1 3.741-.479M12 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm12 0a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" /></svg>;


export default Telemedicine;