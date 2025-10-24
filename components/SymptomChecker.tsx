
import React, { useState } from 'react';
import { getSymptomAnalysis } from '../services/geminiService';
import Spinner from './ui/Spinner';

const SymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setError('Vui lòng nhập triệu chứng.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setAnalysis('');

    try {
      const result = await getSymptomAnalysis(symptoms);
      setAnalysis(result);
    } catch (err) {
      setError('Không thể lấy phân tích. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAnalysis = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('**')) {
          return <p key={index} className="font-bold mt-2">{line.replace(/\*\*/g, '')}</p>;
        }
        if (line.startsWith('* ')) {
          return <li key={index} className="ml-5 list-disc">{line.replace('* ', '')}</li>;
        }
        if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
            return <li key={index} className="ml-5 list-decimal">{line.substring(3)}</li>
        }
        return <p key={index} className="my-1">{line}</p>;
      });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="flex items-center mb-6">
          <SparklesIcon />
          <h2 className="ml-3 text-2xl font-bold">Kiểm tra triệu chứng dựa trên AI</h2>
        </div>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Nhập các triệu chứng của bệnh nhân vào bên dưới để nhận phân tích sơ bộ. Công cụ này chỉ dành cho mục đích thông tin và không thay thế cho chẩn đoán y tế chuyên nghiệp.
        </p>
        
        <div className="mb-4">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Ví dụ: sốt, ho khan, mệt mỏi, đau đầu..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={5}
          />
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isLoading ? <Spinner /> : 'Phân tích triệu chứng'}
        </button>
      </div>

      {analysis && (
        <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Kết quả phân tích</h3>
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            {formatAnalysis(analysis)}
          </div>
        </div>
      )}
    </div>
  );
};

const SparklesIcon = () => <svg className="w-8 h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 4 4-4 5.293-5.293a1 1 0 011.414 0L21 12m-5-9l2.293 2.293a1 1 0 010 1.414l-2.293 2.293" /></svg>;

export default SymptomChecker;
