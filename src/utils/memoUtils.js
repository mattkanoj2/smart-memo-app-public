import { v4 as uuidv4 } from 'uuid';
import localforage from 'localforage';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// localforageの設定
localforage.config({
  name: 'SmartMemo',
  storeName: 'memos'
});

// デモデータ
const demoMemos = [
  {
    id: '1',
    title: '買い物リスト',
    content: '- 牛乳\n- パン\n- 卵\n- バナナ\n- トマト',
    tags: ['買い物', '日用品'],
    createdAt: new Date('2025-04-20T10:00:00').toISOString(),
    updatedAt: new Date('2025-04-21T15:30:00').toISOString(),
    isFavorite: false,
    isArchived: false,
    isDeleted: false,
  },
  {
    id: '2',
    title: 'プロジェクト会議メモ',
    content: '## アジェンダ\n1. 前回の振り返り\n2. 進捗状況の確認\n3. 課題の共有\n4. 次回までのタスク\n\n## メモ\n- UIデザインは来週までに完成予定\n- バックエンドAPIは80%完了\n- テスト環境の準備が必要',
    tags: ['仕事', '会議'],
    createdAt: new Date('2025-04-19T14:00:00').toISOString(),
    updatedAt: new Date('2025-04-19T16:15:00').toISOString(),
    isFavorite: true,
    isArchived: false,
    isDeleted: false,
  },
  {
    id: '3',
    title: '読書メモ：「エンジニアリングマネージャーのしごと」',
    content: '# 主な学び\n\n- 1on1ミーティングの重要性\n- フィードバックの与え方\n- チームビルディングの方法\n- 技術的負債の管理\n\n# 実践したいこと\n\n- 週次の1on1ミーティングの導入\n- 四半期ごとの振り返りセッション\n- チームの技術ビジョンの文書化',
    tags: ['読書', '自己啓発', 'マネジメント'],
    createdAt: new Date('2025-04-18T20:30:00').toISOString(),
    updatedAt: new Date('2025-04-18T21:45:00').toISOString(),
    isFavorite: true,
    isArchived: false,
    isDeleted: false,
  },
  {
    id: '4',
    title: '旅行計画：京都',
    content: '## 行きたい場所\n- 清水寺\n- 金閣寺\n- 伏見稲荷大社\n- 嵐山\n\n## 宿泊\n- 4/29-5/2（3泊4日）\n- ホテルの予約が必要\n\n## 持ち物\n- カメラ\n- 歩きやすい靴\n- ガイドブック',
    tags: ['旅行', '計画'],
    createdAt: new Date('2025-04-15T18:20:00').toISOString(),
    updatedAt: new Date('2025-04-22T12:10:00').toISOString(),
    isFavorite: false,
    isArchived: true,
    isDeleted: false,
  },
  {
    id: '5',
    title: '削除予定の古いメモ',
    content: 'これは削除予定の古いメモです。',
    tags: [],
    createdAt: new Date('2025-03-10T09:45:00').toISOString(),
    updatedAt: new Date('2025-03-10T09:45:00').toISOString(),
    isFavorite: false,
    isArchived: false,
    isDeleted: true,
  }
];

// データベース初期化
export const initDatabase = async () => {
  const initialized = await localforage.getItem('initialized');
  
  if (!initialized) {
    // デモデータを保存
    for (const memo of demoMemos) {
      await localforage.setItem(memo.id, memo);
    }
    
    // 初期化フラグを設定
    await localforage.setItem('initialized', true);
    return true;
  }
  
  return false;
};

// メモの一覧取得
export const getMemos = async (filter = {}) => {
  const memos = [];
  
  await localforage.iterate((value, key) => {
    if (key !== 'initialized' && typeof value === 'object') {
      let include = true;
      
      // フィルタリング
      if (filter.onlyFavorites && !value.isFavorite) include = false;
      if (filter.onlyArchived && !value.isArchived) include = false;
      if (filter.onlyDeleted && !value.isDeleted) include = false;
      if (!filter.includeDeleted && value.isDeleted) include = false;
      if (!filter.includeArchived && value.isArchived) include = false;
      if (filter.tag && !value.tags.includes(filter.tag)) include = false;
      if (filter.search && !(
        value.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        value.content.toLowerCase().includes(filter.search.toLowerCase())
      )) include = false;
      
      if (include) {
        memos.push(value);
      }
    }
  });
  
  // ソート
  memos.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  
  return memos;
};

// メモの取得
export const getMemo = async (id) => {
  return await localforage.getItem(id);
};

// メモの保存
export const saveMemo = async (memo) => {
  const now = new Date().toISOString();
  
  if (!memo.id) {
    // 新規メモ
    memo.id = uuidv4();
    memo.createdAt = now;
    memo.isFavorite = false;
    memo.isArchived = false;
    memo.isDeleted = false;
  }
  
  // 更新日時を設定
  memo.updatedAt = now;
  
  // タグが配列でない場合は配列に変換
  if (!Array.isArray(memo.tags)) {
    memo.tags = [];
  }
  
  // データベースに保存
  await localforage.setItem(memo.id, memo);
  
  return memo;
};

// メモの削除（ゴミ箱に移動）
export const deleteMemo = async (id) => {
  const memo = await getMemo(id);
  
  if (memo) {
    memo.isDeleted = true;
    memo.updatedAt = new Date().toISOString();
    await localforage.setItem(id, memo);
    return true;
  }
  
  return false;
};

// メモの完全削除
export const permanentlyDeleteMemo = async (id) => {
  await localforage.removeItem(id);
  return true;
};

// メモの復元
export const restoreMemo = async (id) => {
  const memo = await getMemo(id);
  
  if (memo && memo.isDeleted) {
    memo.isDeleted = false;
    memo.updatedAt = new Date().toISOString();
    await localforage.setItem(id, memo);
    return true;
  }
  
  return false;
};

// お気に入り切り替え
export const toggleFavorite = async (id) => {
  const memo = await getMemo(id);
  
  if (memo) {
    memo.isFavorite = !memo.isFavorite;
    memo.updatedAt = new Date().toISOString();
    await localforage.setItem(id, memo);
    return memo.isFavorite;
  }
  
  return false;
};

// アーカイブ切り替え
export const toggleArchive = async (id) => {
  const memo = await getMemo(id);
  
  if (memo) {
    memo.isArchived = !memo.isArchived;
    memo.updatedAt = new Date().toISOString();
    await localforage.setItem(id, memo);
    return memo.isArchived;
  }
  
  return false;
};

// 全てのタグを取得
export const getAllTags = async () => {
  const tags = new Set();
  
  await localforage.iterate((value, key) => {
    if (key !== 'initialized' && typeof value === 'object' && !value.isDeleted) {
      for (const tag of value.tags) {
        tags.add(tag);
      }
    }
  });
  
  return Array.from(tags).map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name
  })).sort((a, b) => a.name.localeCompare(b.name));
};

// カテゴリー別の統計を取得（仮の実装）
export const getCategoryStats = () => {
  // 実際のアプリではasyncにしてlocalforageからカウントする
  return {
    all: 4,
    favorites: 2,
    archived: 1,
    trash: 1,
    tags: [
      { id: 'shopping', name: '買い物' },
      { id: 'daily', name: '日用品' },
      { id: 'work', name: '仕事' },
      { id: 'meeting', name: '会議' },
      { id: 'reading', name: '読書' },
      { id: 'self-improvement', name: '自己啓発' },
      { id: 'management', name: 'マネジメント' },
      { id: 'travel', name: '旅行' },
      { id: 'planning', name: '計画' }
    ]
  };
};

// 日付のフォーマット
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'yyyy年MM月dd日 HH:mm', { locale: ja });
};

// テキスト内のURLをリンクに変換
export const linkifyText = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
};

// テキスト内のタグを検出
export const detectTags = (text) => {
  const tagRegex = /#(\w+)/g;
  const tags = [];
  let match;
  
  while ((match = tagRegex.exec(text)) !== null) {
    tags.push(match[1]);
  }
  
  return [...new Set(tags)]; // 重複を削除
};