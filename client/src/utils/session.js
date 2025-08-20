// 生成唯一的會話 ID
export const generateSessionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `session_${timestamp}_${random}`;
};

// 儲存會話資料到 localStorage
export const saveSessionData = (sessionId, data) => {
  try {
    localStorage.setItem(`session_${sessionId}`, JSON.stringify(data));
  } catch (error) {
    console.error('儲存會話資料失敗:', error);
  }
};

// 從 localStorage 獲取會話資料
export const getSessionData = (sessionId) => {
  try {
    const data = localStorage.getItem(`session_${sessionId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('獲取會話資料失敗:', error);
    return null;
  }
};

// 清除會話資料
export const clearSessionData = (sessionId) => {
  try {
    localStorage.removeItem(`session_${sessionId}`);
  } catch (error) {
    console.error('清除會話資料失敗:', error);
  }
};
