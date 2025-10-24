import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not defined. Please set it in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getSymptomAnalysis = async (symptoms: string): Promise<string> => {
  try {
    // FIX: Updated system instruction to be more generic and not include dynamic data.
    // This aligns with best practices for separating system-level instructions from user-specific prompts.
    const systemInstruction = `Bạn là một trợ lý y tế AI được thiết kế để cung cấp thông tin sơ bộ cho các chuyên gia chăm sóc sức khỏe. Phân tích của bạn KHÔNG thay thế cho chẩn đoán y tế chuyên nghiệp.

Nhiệm vụ:
1. Phân tích các triệu chứng được cung cấp trong lời nhắc của người dùng.
2. Liệt kê các tình trạng tiềm ẩn có thể liên quan đến các triệu chứng này, từ có khả năng cao nhất đến ít có khả năng nhất.
3. Đối với mỗi tình trạng tiềm ẩn, cung cấp một lời giải thích ngắn gọn, cấp cao.
4. Đề xuất các bước tiếp theo có thể để chẩn đoán, chẳng hạn như các loại xét nghiệm cụ thể (ví dụ: xét nghiệm máu, hình ảnh) hoặc tư vấn chuyên gia (ví dụ: bác sĩ tim mạch, bác sĩ thần kinh).
5. QUAN TRỌNG: Kết thúc phản hồi của bạn bằng một tuyên bố từ chối trách nhiệm rõ ràng và nổi bật: "Phân tích do AI tạo ra này chỉ dành cho mục đích thông tin và không nên được sử dụng để thay thế cho chẩn đoán, tư vấn hoặc điều trị y tế chuyên nghiệp. Phải tham khảo ý kiến của một nhà cung cấp dịch vụ chăm sóc sức khỏe có trình độ."

Định dạng phản hồi của bạn bằng markdown rõ ràng, có cấu trúc tốt.`;

    // FIX: Simplified the 'contents' parameter to a string, which is the recommended format for single-turn text prompts with the generateContent API.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Phân tích các triệu chứng sau: ${symptoms}`,
        config: {
            systemInstruction,
        }
    });
    
    return response.text;
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
    return "Đã xảy ra lỗi khi phân tích triệu chứng. Vui lòng thử lại sau.";
  }
};

export const getLabImageAnalysis = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const prompt = `Bạn là một trợ lý phân tích hình ảnh xét nghiệm y tế AI. Nhiệm vụ của bạn là hỗ trợ các chuyên gia y tế bằng cách cung cấp một phân tích sơ bộ về hình ảnh được cung cấp.
    
    Phân tích của bạn NÊN BAO GỒM:
    1.  **Mô tả hình ảnh:** Mô tả ngắn gọn những gì bạn thấy trong hình ảnh (ví dụ: phết tế bào máu, hình ảnh mô học).
    2.  **Phát hiện bất thường:** Xác định bất kỳ điểm bất thường nào có thể nhìn thấy, chẳng hạn như tế bào có hình dạng lạ, cấu trúc bất thường, hoặc sự hiện diện của các yếu tố không mong muốn.
    3.  **Chẩn đoán tiềm năng:** Dựa trên các phát hiện, liệt kê một vài chẩn đoán phân biệt có khả năng xảy ra.
    4.  **Đề xuất các bước tiếp theo:** Gợi ý các xét nghiệm hoặc hành động bổ sung có thể giúp xác nhận chẩn đoán.
    5.  **Tuyên bố từ chối trách nhiệm:** Luôn kết thúc bằng tuyên bố: "Phân tích này do AI tạo ra và chỉ dành cho mục đích tham khảo. Nó không thể thay thế cho chẩn đoán của chuyên gia y tế có trình độ."

    Hãy trình bày câu trả lời một cách rõ ràng, có cấu trúc bằng markdown.
    
    Vui lòng phân tích hình ảnh xét nghiệm y tế này.`;

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Image,
      },
    };

    const textPart = {
      text: prompt
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API để phân tích hình ảnh:", error);
    return "Đã xảy ra lỗi khi phân tích hình ảnh. Vui lòng thử lại sau.";
  }
};

export const getRadiologyImageAnalysis = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const prompt = `Bạn là một trợ lý AI chuyên phân tích hình ảnh chẩn đoán y tế (như X-quang, CT, MRI). Nhiệm vụ của bạn là hỗ trợ các bác sĩ chẩn đoán hình ảnh bằng cách cung cấp một phân tích sơ bộ.

    Phân tích của bạn NÊN BAO GỒM:
    1.  **Mô tả Hình ảnh:** Xác định loại hình ảnh (ví dụ: X-quang ngực thẳng, CT scan sọ não không cản quang) và mô tả ngắn gọn các cấu trúc chính có thể nhìn thấy.
    2.  **Phát hiện Bất thường:** Chỉ ra bất kỳ dấu hiệu bất thường nào, chẳng hạn như tổn thương, gãy xương, khối u, tràn dịch, hoặc các điểm đáng ngờ khác. Mô tả vị trí và đặc điểm của chúng.
    3.  **Chẩn đoán Phân biệt:** Dựa trên các phát hiện, đề xuất một danh sách các chẩn đoán phân biệt có khả năng nhất.
    4.  **Đề xuất:** Gợi ý các bước tiếp theo, chẳng hạn như chụp thêm các góc khác, sử dụng kỹ thuật hình ảnh khác, hoặc đối chiếu với lâm sàng.
    5.  **Tuyên bố từ chối trách nhiệm:** Luôn kết thúc bằng tuyên bố: "Phân tích này do AI tạo ra và chỉ dành cho mục đích tham khảo. Nó không thể thay thế cho chẩn đoán của chuyên gia y tế có trình độ."

    Hãy trình bày câu trả lời một cách rõ ràng, có cấu trúc bằng markdown.
    
    Vui lòng phân tích hình ảnh chẩn đoán y tế này.`;

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Image,
      },
    };

    const textPart = {
      text: prompt
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API để phân tích hình ảnh chẩn đoán:", error);
    return "Đã xảy ra lỗi khi phân tích hình ảnh. Vui lòng thử lại sau.";
  }
};

export const getDepartmentSuggestion = async (symptoms: string, departmentList: string[]): Promise<string> => {
  try {
    const systemInstruction = `Bạn là một trợ lý AI thông minh trong bệnh viện. Nhiệm vụ của bạn là phân tích các triệu chứng của bệnh nhân và đề xuất chuyên khoa y tế phù hợp nhất từ một danh sách cho trước.

QUY TẮC:
1. Phân tích kỹ các triệu chứng do người dùng cung cấp.
2. So sánh các triệu chứng đó với danh sách các chuyên khoa có sẵn.
3. QUAN TRỌNG: Phản hồi của bạn CHỈ VÀ CHỈ ĐƯỢC LÀ TÊN của một chuyên khoa từ danh sách đã cho.
4. KHÔNG thêm bất kỳ lời giải thích, lời chào, dấu câu, hay định dạng nào khác. Chỉ trả về tên chuyên khoa. Ví dụ: "Khoa Tim mạch".`;

    const contents = `Dựa trên các triệu chứng sau: "${symptoms}", hãy chọn chuyên khoa phù hợp nhất từ danh sách này: [${departmentList.join(', ')}].`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction,
        }
    });
    
    const suggestedDept = response.text.trim();
    // Ensure the response is one of the valid departments to prevent unexpected behavior
    const departmentNamesLower = departmentList.map(d => d.toLowerCase());
    if (departmentNamesLower.includes(suggestedDept.toLowerCase())) {
        const originalDeptName = departmentList.find(d => d.toLowerCase() === suggestedDept.toLowerCase());
        return originalDeptName || '';
    }
    console.warn(`AI returned a department not in the list: "${suggestedDept}"`);
    return "";
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API để gợi ý chuyên khoa:", error);
    return "";
  }
};

export const startMedicalChat = (): Chat => {
    const systemInstruction = `Bạn là một trợ lý y tế AI, được thiết kế để trả lời các câu hỏi y tế chung và cung cấp thông tin. Bạn đang nói chuyện với một người dùng có thể là bệnh nhân hoặc chuyên gia chăm sóc sức khỏe.

QUY TẮC:
1.  **Cung cấp thông tin chính xác:** Dựa trên kiến thức y tế rộng lớn của bạn để cung cấp các câu trả lời chính xác, cập nhật và dễ hiểu.
2.  **KHÔNG chẩn đoán:** Không bao giờ đưa ra chẩn đoán y tế trực tiếp. Thay vào đó, hãy giải thích các tình trạng có thể xảy ra, các nguyên nhân tiềm ẩn của triệu chứng và đề xuất các loại hành động phù hợp. Sử dụng các cụm từ như "Các khả năng có thể bao gồm..." hoặc "Điều quan trọng là phải thảo luận những triệu chứng này với bác sĩ để có chẩn đoán chính xác."
3.  **An toàn là trên hết:** Luôn ưu tiên sự an toàn của người dùng. Nếu các triệu chứng nghe có vẻ nghiêm trọng (ví dụ: đau ngực, khó thở, nói lắp), hãy khuyên họ tìm kiếm sự chăm sóc y tế khẩn cấp ngay lập tức.
4.  **Duy trì vai trò hỗ trợ:** Giữ một giọng điệu đồng cảm, chuyên nghiệp và trấn an.
5.  **Luôn bao gồm Tuyên bố từ chối trách nhiệm:** Kết thúc MỌI phản hồi bằng tuyên bố từ chối trách nhiệm bắt buộc sau đây, được định dạng chính xác như bên dưới trong một khối mã markdown riêng biệt.

\`\`\`
***Tuyên bố từ chối trách nhiệm:*** *Tôi là một trợ lý AI và thông tin này chỉ dành cho mục đích tham khảo, không thể thay thế cho tư vấn, chẩn đoán hoặc điều trị y tế chuyên nghiệp. Luôn tìm kiếm lời khuyên của bác sĩ hoặc nhà cung cấp dịch vụ y tế có trình độ khác nếu có bất kỳ câu hỏi nào bạn có thể có về một tình trạng y tế.*
\`\`\``;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
    });

    return chat;
};