const express = require('express');
const axios = require('axios');
const User = require('../models/User');

const router = express.Router();

// 本地職業提取函數
function extractProfessionFromText(text) {
  const lowerText = text.toLowerCase();
  
  // 職業關鍵詞映射
  const professionKeywords = {
    '醫生': ['醫生', '醫師', '大夫', '醫', 'doctor', 'physician'],
    '護士': ['護士', '護理師', 'nurse'],
    '教師': ['教師', '老師', '教授', '講師', 'teacher', 'professor'],
    '律師': ['律師', 'lawyer', 'attorney'],
    '工程師': ['工程師', 'engineer'],
    '設計師': ['設計師', 'designer'],
    '會計師': ['會計師', 'accountant'],
    '建築師': ['建築師', 'architect'],
    '警察': ['警察', 'police', 'officer'],
    '消防員': ['消防員', 'firefighter'],
    '軍人': ['軍人', 'soldier', 'military'],
    '飛行員': ['飛行員', 'pilot'],
    '廚師': ['廚師', 'chef', 'cook'],
    '攝影師': ['攝影師', 'photographer'],
    '藝術家': ['藝術家', 'artist'],
    '音樂家': ['音樂家', 'musician'],
    '演員': ['演員', 'actor', 'actress'],
    '運動員': ['運動員', 'athlete'],
    '科學家': ['科學家', 'scientist'],
    '記者': ['記者', 'journalist', 'reporter'],
    '程式設計師': ['程式設計師', 'programmer', 'developer'],
    '護理師': ['護理師', 'nurse'],
    '營養師': ['營養師', 'nutritionist'],
    '心理師': ['心理師', 'psychologist'],
    '社工': ['社工', 'social worker'],
    '翻譯': ['翻譯', 'translator'],
    '導遊': ['導遊', 'tour guide'],
    '教授': ['教授', 'professor'],
    '學者': ['學者', 'scholar'],
    '專家': ['專家', 'expert'],
    '顧問': ['顧問', 'consultant'],
    '分析師': ['分析師', 'analyst'],
    '經理': ['經理', 'manager'],
    '主管': ['主管', 'supervisor'],
    '老闆': ['老闆', 'boss', 'owner'],
    '企業家': ['企業家', 'entrepreneur'],
    '研究員': ['研究員', 'researcher'],
    '作家': ['作家', 'writer', 'author'],
    '導演': ['導演', 'director'],
    '主持人': ['主持人', 'host', 'presenter'],
    '主播': ['主播', 'anchor'],
    '教練': ['教練', 'coach'],
    '司機': ['司機', 'driver'],
    '服務員': ['服務員', 'waiter', 'waitress'],
    '銷售員': ['銷售員', 'salesperson'],
    '技師': ['技師', 'technician'],
    '維修員': ['維修員', 'repairman'],
    '清潔員': ['清潔員', 'cleaner'],
    '保全': ['保全', 'security'],
    '警衛': ['警衛', 'guard'],
    '園丁': ['園丁', 'gardener'],
    '農夫': ['農夫', 'farmer'],
    '漁夫': ['漁夫', 'fisherman'],
    '礦工': ['礦工', 'miner'],
    '工人': ['工人', 'worker'],
    '技工': ['技工', 'mechanic'],
    '電工': ['電工', 'electrician'],
    '水電工': ['水電工', 'plumber'],
    '木工': ['木工', 'carpenter'],
    '油漆工': ['油漆工', 'painter'],
    '泥水工': ['泥水工', 'mason'],
    '鐵工': ['鐵工', 'blacksmith'],
    '焊接工': ['焊接工', 'welder'],
    '機械工': ['機械工', 'machinist'],
    '汽車技師': ['汽車技師', 'auto mechanic'],
    '機車技師': ['機車技師', 'motorcycle mechanic'],
    '美容師': ['美容師', 'beautician'],
    '理髮師': ['理髮師', 'barber', 'hairdresser'],
    '化妝師': ['化妝師', 'makeup artist'],
    '造型師': ['造型師', 'stylist'],
    '服裝設計師': ['服裝設計師', 'fashion designer'],
    '珠寶設計師': ['珠寶設計師', 'jewelry designer'],
    '室內設計師': ['室內設計師', 'interior designer'],
    '景觀設計師': ['景觀設計師', 'landscape designer'],
    '平面設計師': ['平面設計師', 'graphic designer'],
    '網頁設計師': ['網頁設計師', 'web designer'],
    'UI設計師': ['UI設計師', 'UI designer'],
    'UX設計師': ['UX設計師', 'UX designer'],
    '遊戲設計師': ['遊戲設計師', 'game designer'],
    '動畫師': ['動畫師', 'animator'],
    '特效師': ['特效師', 'special effects artist'],
    '剪輯師': ['剪輯師', 'editor'],
    '音效師': ['音效師', 'sound engineer'],
    '調音師': ['調音師', 'tuner'],
    '錄音師': ['錄音師', 'recording engineer'],
    '混音師': ['混音師', 'mixer'],
    '製作人': ['製作人', 'producer'],
    '編劇': ['編劇', 'screenwriter'],
    '製片': ['製片', 'producer'],
    '場記': ['場記', 'script supervisor'],
    '燈光師': ['燈光師', 'lighting technician'],
    '攝影助理': ['攝影助理', 'camera assistant'],
    '化妝助理': ['化妝助理', 'makeup assistant'],
    '服裝助理': ['服裝助理', 'costume assistant'],
    '道具師': ['道具師', 'prop master'],
    '佈景師': ['佈景師', 'set designer'],
    '特效化妝師': ['特效化妝師', 'special effects makeup artist'],
    '替身演員': ['替身演員', 'stunt double'],
    '配音員': ['配音員', 'voice actor'],
    '聲優': ['聲優', 'voice actor'],
    '模特兒': ['模特兒', 'model'],
    '舞者': ['舞者', 'dancer'],
    '歌手': ['歌手', 'singer'],
    '樂手': ['樂手', 'musician'],
    '指揮家': ['指揮家', 'conductor'],
    '作曲家': ['作曲家', 'composer'],
    '編曲家': ['編曲家', 'arranger'],
    '音樂製作人': ['音樂製作人', 'music producer'],
    '錄音工程師': ['錄音工程師', 'recording engineer'],
    '混音工程師': ['混音工程師', 'mixing engineer'],
    '母帶工程師': ['母帶工程師', 'mastering engineer'],
    '音響師': ['音響師', 'sound engineer'],
    '樂器技師': ['樂器技師', 'instrument technician'],
    '鋼琴調音師': ['鋼琴調音師', 'piano tuner'],
    '小提琴製琴師': ['小提琴製琴師', 'violin maker'],
    '吉他製琴師': ['吉他製琴師', 'guitar maker'],
    '鼓手': ['鼓手', 'drummer'],
    '貝斯手': ['貝斯手', 'bassist'],
    '吉他手': ['吉他手', 'guitarist'],
    '鍵盤手': ['鍵盤手', 'keyboardist'],
    '主唱': ['主唱', 'vocalist'],
    '和聲': ['和聲', 'backup singer'],
    '合唱團': ['合唱團', 'choir'],
    '管弦樂團': ['管弦樂團', 'orchestra'],
    '交響樂團': ['交響樂團', 'symphony'],
    '室內樂團': ['室內樂團', 'chamber ensemble'],
    '爵士樂團': ['爵士樂團', 'jazz band'],
    '搖滾樂團': ['搖滾樂團', 'rock band'],
    '流行樂團': ['流行樂團', 'pop band'],
    '民謠樂團': ['民謠樂團', 'folk band'],
    '古典樂團': ['古典樂團', 'classical ensemble'],
    '電子樂團': ['電子樂團', 'electronic band'],
    '嘻哈樂團': ['嘻哈樂團', 'hip hop group'],
    '饒舌歌手': ['饒舌歌手', 'rapper'],
    'DJ': ['DJ', 'disc jockey'],
    'MC': ['MC', 'master of ceremonies'],
    '編舞家': ['編舞家', 'choreographer'],
    '舞蹈老師': ['舞蹈老師', 'dance teacher'],
    '瑜珈老師': ['瑜珈老師', 'yoga teacher'],
    '健身教練': ['健身教練', 'personal trainer'],
    '游泳教練': ['游泳教練', 'swimming coach'],
    '網球教練': ['網球教練', 'tennis coach'],
    '籃球教練': ['籃球教練', 'basketball coach'],
    '足球教練': ['足球教練', 'soccer coach'],
    '棒球教練': ['棒球教練', 'baseball coach'],
    '排球教練': ['排球教練', 'volleyball coach'],
    '羽球教練': ['羽球教練', 'badminton coach'],
    '桌球教練': ['桌球教練', 'table tennis coach'],
    '高爾夫教練': ['高爾夫教練', 'golf coach'],
    '滑雪教練': ['滑雪教練', 'ski instructor'],
    '衝浪教練': ['衝浪教練', 'surf instructor'],
    '潛水教練': ['潛水教練', 'diving instructor'],
    '攀岩教練': ['攀岩教練', 'rock climbing instructor'],
    '登山嚮導': ['登山嚮導', 'mountain guide'],
    '旅遊領隊': ['旅遊領隊', 'tour leader'],
    '導遊': ['導遊', 'tour guide'],
    '解說員': ['解說員', 'interpreter'],
    '博物館員': ['博物館員', 'museum curator'],
    '圖書館員': ['圖書館員', 'librarian'],
    '檔案管理員': ['檔案管理員', 'archivist'],
    '資料管理員': ['資料管理員', 'data manager'],
    '系統管理員': ['系統管理員', 'system administrator'],
    '網路管理員': ['網路管理員', 'network administrator'],
    '資料庫管理員': ['資料庫管理員', 'database administrator'],
    '伺服器管理員': ['伺服器管理員', 'server administrator'],
    '安全工程師': ['安全工程師', 'security engineer'],
    '資安工程師': ['資安工程師', 'cybersecurity engineer'],
    '網路安全工程師': ['網路安全工程師', 'network security engineer'],
    '滲透測試工程師': ['滲透測試工程師', 'penetration tester'],
    '資安顧問': ['資安顧問', 'cybersecurity consultant'],
    '資安分析師': ['資安分析師', 'cybersecurity analyst'],
    '資安管理師': ['資安管理師', 'cybersecurity manager'],
    '資安稽核師': ['資安稽核師', 'cybersecurity auditor'],
    '資安法規專家': ['資安法規專家', 'cybersecurity compliance expert'],
    '資安教育訓練師': ['資安教育訓練師', 'cybersecurity trainer'],
    '資安事件處理師': ['資安事件處理師', 'cybersecurity incident responder'],
    '資安應變工程師': ['資安應變工程師', 'cybersecurity response engineer'],
    '資安復原工程師': ['資安復原工程師', 'cybersecurity recovery engineer'],
    '資安風險管理師': ['資安風險管理師', 'cybersecurity risk manager'],
    '資安政策制定師': ['資安政策制定師', 'cybersecurity policy maker'],
    '資安標準制定師': ['資安標準制定師', 'cybersecurity standards developer'],
    '資安認證工程師': ['資安認證工程師', 'cybersecurity certification engineer'],
    '資安合規工程師': ['資安合規工程師', 'cybersecurity compliance engineer'],
    '資安治理專家': ['資安治理專家', 'cybersecurity governance expert'],
    '資安策略顧問': ['資安策略顧問', 'cybersecurity strategy consultant'],
    '資安總監': ['資安總監', 'cybersecurity director'],
    '資安長': ['資安長', 'chief security officer'],
    '資訊長': ['資訊長', 'chief information officer'],
    '技術長': ['技術長', 'chief technology officer'],
    '營運長': ['營運長', 'chief operating officer'],
    '財務長': ['財務長', 'chief financial officer'],
    '人資長': ['人資長', 'chief human resources officer'],
    '行銷長': ['行銷長', 'chief marketing officer'],
    '業務長': ['業務長', 'chief business officer'],
    '法務長': ['法務長', 'chief legal officer'],
    '公關長': ['公關長', 'chief public relations officer'],
    '永續長': ['永續長', 'chief sustainability officer'],
    '創新長': ['創新長', 'chief innovation officer'],
    '數位長': ['數位長', 'chief digital officer'],
    '轉型長': ['轉型長', 'chief transformation officer'],
    '策略長': ['策略長', 'chief strategy officer'],
    '顧問長': ['顧問長', 'chief advisor'],
    '總經理': ['總經理', 'general manager'],
    '副總經理': ['副總經理', 'deputy general manager'],
    '協理': ['協理', 'assistant manager'],
    '經理': ['經理', 'manager'],
    '副理': ['副理', 'deputy manager'],
    '主任': ['主任', 'director'],
    '組長': ['組長', 'team leader'],
    '課長': ['課長', 'section chief'],
    '股長': ['股長', 'unit chief'],
    '專員': ['專員', 'specialist'],
    '助理': ['助理', 'assistant'],
    '實習生': ['實習生', 'intern'],
    '工讀生': ['工讀生', 'part-time student'],
    '兼職': ['兼職', 'part-time'],
    '全職': ['全職', 'full-time'],
    '自由工作者': ['自由工作者', 'freelancer'],
    '接案者': ['接案者', 'contractor'],
    '創業家': ['創業家', 'entrepreneur'],
    '投資人': ['投資人', 'investor'],
    '股東': ['股東', 'shareholder'],
    '董事': ['董事', 'director'],
    '監事': ['監事', 'supervisor'],
    '顧問': ['顧問', 'consultant'],
    '委員': ['委員', 'committee member'],
    '代表': ['代表', 'representative'],
    '大使': ['大使', 'ambassador'],
    '特使': ['特使', 'special envoy'],
    '專員': ['專員', 'specialist'],
    '專案': ['專案', 'project'],
    '計畫': ['計畫', 'plan'],
    '專案經理': ['專案經理', 'project manager'],
    '產品經理': ['產品經理', 'product manager'],
    '專案助理': ['專案助理', 'project assistant'],
    '產品助理': ['產品助理', 'product assistant'],
    '業務助理': ['業務助理', 'business assistant'],
    '行政助理': ['行政助理', 'administrative assistant'],
    '人資助理': ['人資助理', 'HR assistant'],
    '財務助理': ['財務助理', 'finance assistant'],
    '會計助理': ['會計助理', 'accounting assistant'],
    '法務助理': ['法務助理', 'legal assistant'],
    '公關助理': ['公關助理', 'public relations assistant'],
    '行銷助理': ['行銷助理', 'marketing assistant'],
    '企劃助理': ['企劃助理', 'planning assistant'],
    '設計助理': ['設計助理', 'design assistant'],
    '工程助理': ['工程助理', 'engineering assistant'],
    '技術助理': ['技術助理', 'technical assistant'],
    '研究助理': ['研究助理', 'research assistant'],
    '教學助理': ['教學助理', 'teaching assistant'],
    '研究員': ['研究員', 'researcher'],
    '助理研究員': ['助理研究員', 'assistant researcher'],
    '副研究員': ['副研究員', 'associate researcher'],
    '資深研究員': ['資深研究員', 'senior researcher'],
    '首席研究員': ['首席研究員', 'principal researcher'],
    '研究總監': ['研究總監', 'research director'],
    '研究長': ['研究長', 'chief research officer'],
    '研發長': ['研發長', 'chief R&D officer'],
    '研發經理': ['研發經理', 'R&D manager'],
    '研發工程師': ['研發工程師', 'R&D engineer'],
    '研發助理': ['研發助理', 'R&D assistant'],
    '研發專員': ['研發專員', 'R&D specialist'],
    '研發主管': ['研發主管', 'R&D supervisor'],
    '研發總監': ['研發總監', 'R&D director'],
    '研發副總': ['研發副總', 'deputy R&D vice president'],
    '研發總經理': ['研發總經理', 'R&D general manager'],
    '創新長': ['創新長', 'chief innovation officer'],
    '創新經理': ['創新經理', 'innovation manager'],
    '創新工程師': ['創新工程師', 'innovation engineer'],
    '創新助理': ['創新助理', 'innovation assistant'],
    '創新專員': ['創新專員', 'innovation specialist'],
    '創新主管': ['創新主管', 'innovation supervisor'],
    '創新總監': ['創新總監', 'innovation director'],
    '創新副總': ['創新副總', 'deputy innovation vice president'],
    '創新總經理': ['創新總經理', 'innovation general manager'],
    '數位長': ['數位長', 'chief digital officer'],
    '數位經理': ['數位經理', 'digital manager'],
    '數位工程師': ['數位工程師', 'digital engineer'],
    '數位助理': ['數位助理', 'digital assistant'],
    '數位專員': ['數位專員', 'digital specialist'],
    '數位主管': ['數位主管', 'digital supervisor'],
    '數位總監': ['數位總監', 'digital director'],
    '數位副總': ['數位副總', 'deputy digital vice president'],
    '數位總經理': ['數位總經理', 'digital general manager'],
    '轉型長': ['轉型長', 'chief transformation officer'],
    '轉型經理': ['轉型經理', 'transformation manager'],
    '轉型工程師': ['轉型工程師', 'transformation engineer'],
    '轉型助理': ['轉型助理', 'transformation assistant'],
    '轉型專員': ['轉型專員', 'transformation specialist'],
    '轉型主管': ['轉型主管', 'transformation supervisor'],
    '轉型總監': ['轉型總監', 'transformation director'],
    '轉型副總': ['轉型副總', 'deputy transformation vice president'],
    '轉型總經理': ['轉型總經理', 'transformation general manager'],
    '策略長': ['策略長', 'chief strategy officer'],
    '策略經理': ['策略經理', 'strategy manager'],
    '策略工程師': ['策略工程師', 'strategy engineer'],
    '策略助理': ['策略助理', 'strategy assistant'],
    '策略專員': ['策略專員', 'strategy specialist'],
    '策略主管': ['策略主管', 'strategy supervisor'],
    '策略總監': ['策略總監', 'strategy director'],
    '策略副總': ['策略副總', 'deputy strategy vice president'],
    '策略總經理': ['策略總經理', 'strategy general manager'],
    '顧問長': ['顧問長', 'chief advisor'],
    '顧問經理': ['顧問經理', 'advisor manager'],
    '顧問工程師': ['顧問工程師', 'advisor engineer'],
    '顧問助理': ['顧問助理', 'advisor assistant'],
    '顧問專員': ['顧問專員', 'advisor specialist'],
    '顧問主管': ['顧問主管', 'advisor supervisor'],
    '顧問總監': ['顧問總監', 'advisor director'],
    '顧問副總': ['顧問副總', 'deputy advisor vice president'],
    '顧問總經理': ['顧問總經理', 'advisor general manager']
  };

  // 檢查文字中是否包含職業關鍵詞
  for (const [profession, keywords] of Object.entries(professionKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return profession;
      }
    }
  }

  // 如果沒有找到明確的職業，檢查一些常見的表達方式
  const commonPatterns = [
    { pattern: /想當(.+)/, group: 1 },
    { pattern: /要當(.+)/, group: 1 },
    { pattern: /成為(.+)/, group: 1 },
    { pattern: /做(.+)/, group: 1 },
    { pattern: /當(.+)/, group: 1 }
  ];

  for (const { pattern, group } of commonPatterns) {
    const match = text.match(pattern);
    if (match) {
      const potentialProfession = match[group].trim();
      // 檢查提取的職業是否在合法列表中
      for (const [profession, keywords] of Object.entries(professionKeywords)) {
        for (const keyword of keywords) {
          if (potentialProfession.includes(keyword) || keyword.includes(potentialProfession)) {
            return profession;
          }
        }
      }
    }
  }

  return '無職業';
}

// 合法職業列表
const VALID_PROFESSIONS = [
  '醫生', '護士', '教師', '律師', '工程師', '設計師', '會計師', '建築師',
  '警察', '消防員', '軍人', '飛行員', '船長', '司機', '廚師', '服務員',
  '銷售員', '經理', '主管', '老闆', '企業家', '科學家', '研究員', '作家',
  '記者', '攝影師', '藝術家', '音樂家', '演員', '導演', '主持人', '主播',
  '運動員', '教練', '營養師', '心理師', '社工', '翻譯', '導遊', '導師',
  '教授', '學者', '專家', '顧問', '分析師', '程式設計師', '系統管理員',
  '網路工程師', '資料科學家', '人工智慧工程師', '機器學習工程師',
  '產品經理', '專案經理', '人力資源', '行政助理', '秘書', '助理',
  '技術員', '技師', '維修員', '清潔員', '保全', '警衛', '園丁', '農夫',
  '漁夫', '礦工', '工人', '技工', '電工', '水電工', '木工', '油漆工',
  '泥水工', '鐵工', '焊接工', '機械工', '汽車技師', '機車技師',
  '美容師', '理髮師', '化妝師', '造型師', '服裝設計師', '珠寶設計師',
  '室內設計師', '景觀設計師', '平面設計師', '網頁設計師', 'UI設計師',
  'UX設計師', '遊戲設計師', '動畫師', '特效師', '剪輯師', '音效師',
  '調音師', '錄音師', '混音師', '製作人', '編劇', '製片', '場記',
  '燈光師', '攝影助理', '化妝助理', '服裝助理', '道具師', '佈景師',
  '特效化妝師', '替身演員', '配音員', '聲優', '模特兒', '舞者',
  '歌手', '樂手', '指揮家', '作曲家', '編曲家', '音樂製作人',
  '錄音工程師', '混音工程師', '母帶工程師', '音響師', '調音師',
  '樂器技師', '鋼琴調音師', '小提琴製琴師', '吉他製琴師',
  '鼓手', '貝斯手', '吉他手', '鍵盤手', '主唱', '和聲', '合唱團',
  '管弦樂團', '交響樂團', '室內樂團', '爵士樂團', '搖滾樂團',
  '流行樂團', '民謠樂團', '古典樂團', '電子樂團', '嘻哈樂團',
  '饒舌歌手', 'DJ', 'MC', '舞者', '編舞家', '舞蹈老師', '瑜珈老師',
  '健身教練', '游泳教練', '網球教練', '籃球教練', '足球教練',
  '棒球教練', '排球教練', '羽球教練', '桌球教練', '高爾夫教練',
  '滑雪教練', '衝浪教練', '潛水教練', '攀岩教練', '登山嚮導',
  '旅遊領隊', '導遊', '解說員', '博物館員', '圖書館員', '檔案管理員',
  '資料管理員', '系統管理員', '網路管理員', '資料庫管理員',
  '伺服器管理員', '安全工程師', '資安工程師', '網路安全工程師',
  '滲透測試工程師', '資安顧問', '資安分析師', '資安管理師',
  '資安稽核師', '資安法規專家', '資安教育訓練師', '資安事件處理師',
  '資安應變工程師', '資安復原工程師', '資安風險管理師',
  '資安政策制定師', '資安標準制定師', '資安認證工程師',
  '資安合規工程師', '資安治理專家', '資安策略顧問', '資安總監',
  '資安長', '資訊長', '技術長', '營運長', '財務長', '人資長',
  '行銷長', '業務長', '法務長', '公關長', '永續長', '創新長',
  '數位長', '轉型長', '策略長', '顧問長', '總經理', '副總經理',
  '協理', '經理', '副理', '主任', '組長', '課長', '股長', '專員',
  '助理', '實習生', '工讀生', '兼職', '全職', '自由工作者',
  '接案者', '創業家', '投資人', '股東', '董事', '監事', '顧問',
  '委員', '代表', '大使', '特使', '專員', '專案', '計畫', '專案經理',
  '產品經理', '專案助理', '產品助理', '業務助理', '行政助理',
  '人資助理', '財務助理', '會計助理', '法務助理', '公關助理',
  '行銷助理', '企劃助理', '設計助理', '工程助理', '技術助理',
  '研究助理', '教學助理', '研究員', '助理研究員', '副研究員',
  '研究員', '資深研究員', '首席研究員', '研究總監', '研究長',
  '研發長', '研發經理', '研發工程師', '研發助理', '研發專員',
  '研發主管', '研發總監', '研發副總', '研發總經理', '研發長',
  '創新長', '創新經理', '創新工程師', '創新助理', '創新專員',
  '創新主管', '創新總監', '創新副總', '創新總經理', '創新長',
  '數位長', '數位經理', '數位工程師', '數位助理', '數位專員',
  '數位主管', '數位總監', '數位副總', '數位總經理', '數位長',
  '轉型長', '轉型經理', '轉型工程師', '轉型助理', '轉型專員',
  '轉型主管', '轉型總監', '轉型副總', '轉型總經理', '轉型長',
  '策略長', '策略經理', '策略工程師', '策略助理', '策略專員',
  '策略主管', '策略總監', '策略副總', '策略總經理', '策略長',
  '顧問長', '顧問經理', '顧問工程師', '顧問助理', '顧問專員',
  '顧問主管', '顧問總監', '顧問副總', '顧問總經理', '顧問長'
];

// 職業驗證
router.post('/validate', async (req, res) => {
  try {
    const { text, sessionId } = req.body;

    if (!text) {
      return res.status(400).json({ error: '沒有提供文字內容' });
    }

    // 使用本地規則引擎進行職業提取和驗證
    const extractedProfession = extractProfessionFromText(text);

    // 檢查結果
    if (extractedProfession === '無職業') {
      return res.json({
        valid: false,
        message: '文字中沒有提到職業',
        profession: null
      });
    }

    if (extractedProfession === '職業不合法') {
      return res.json({
        valid: false,
        message: '提到的職業不合法或不合理',
        profession: null
      });
    }

    // 檢查是否在合法職業列表中
    const isValidProfession = VALID_PROFESSIONS.some(profession => 
      extractedProfession.includes(profession) || profession.includes(extractedProfession)
    );

    if (!isValidProfession) {
      return res.json({
        valid: false,
        message: '提到的職業不在合法職業列表中',
        profession: extractedProfession
      });
    }

    // 更新使用者資料
    if (sessionId) {
      let user = await User.findOne({ sessionId });
      if (user) {
        user.profession = extractedProfession;
        user.status = 'photo';
        await user.save();
      }
    }

    res.json({
      valid: true,
      message: '職業驗證成功',
      profession: extractedProfession
    });

  } catch (error) {
    console.error('職業驗證錯誤:', error);
    res.status(500).json({
      error: '職業驗證失敗',
      details: error.message
    });
  }
});

// 獲取職業資訊
router.get('/info/:sessionId', async (req, res) => {
  try {
    const user = await User.findOne({ sessionId: req.params.sessionId });
    if (!user) {
      return res.status(404).json({ error: '找不到該會話' });
    }

    res.json({
      profession: user.profession,
      status: user.status
    });
  } catch (error) {
    res.status(500).json({ error: '獲取職業資訊失敗' });
  }
});

module.exports = router;
