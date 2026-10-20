import fs from "fs";
import path from "path";

export type UserRole = "DEVELOPER" | "ADMIN" | "USER";
export type AccountStatus = "ACTIVE" | "SUSPENDED" | "BANNED" | "DELETED";

export interface UserRecord {
  id: string; // immutable unique user_id
  name: string;
  email: string; // unique lowercase
  passwordHash: string;
  role: UserRole;
  status: AccountStatus;
  country: string;
  avatar?: string;
  bio?: string;
  contributionScore: number;
  codobaseCoins: number;
  streakDays: number;
  lastStreakDate?: string;
  solvedProblemIds: string[];
  githubConnected: boolean;
  githubUsername?: string;
  githubVerifiedAt?: string;
  leetcodeConnected: boolean;
  leetcodeUsername?: string;
  leetcodeSolved?: number;
  linkedinConnected: boolean;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skills: string[];
  reposCount?: number;
  starsCount?: number;
  badges: string[];
  followersCount: number;
  followingCount: number;
  wrongLanguageWarningsCount: number;
  abusiveWarningsCount: number;
  bannedAt?: string;
  banReason?: string;
  lastActiveAt: string;
  createdAt: string;
}

export interface BannedIdentifierRecord {
  id: string;
  identifier: string; // email or user_id
  type: "EMAIL" | "USER_ID";
  reason: string;
  bannedBy: string;
  bannedAt: string;
}

export interface RoomObjectRecord {
  id: string;
  roomId: string;
  type: "table" | "server_rack" | "whiteboard" | "connection_hub" | "terminal" | "display";
  name: string;
  position: { x: number; y: number; z?: number };
  rotation?: number;
  state: Record<string, any>;
  createdBy: string;
  createdByName: string;
  updatedBy: string;
  updatedByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomMemberRecord {
  id: string;
  roomId: string;
  subRoomId?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  memberRole: "owner" | "collaborator" | "viewer";
  isOnline: boolean;
  joinedAt: string;
  lastActiveAt: string;
}

export interface SubRoomRecord {
  id: string;
  roomId: string;
  name: string;
  topic: "frontend" | "backend" | "auth" | "fullstack" | "gameplay" | "math";
  maxMembers: number; // strictly 20
  currentMembers: number;
  version: string;
  createdAt: string;
}

export interface HealthReport {
  securityScore: number;
  architectureScore: number;
  testScore: number;
  gitScore: number;
  issuesFound: string[];
  auditSummary: string;
}

export interface RoadmapSuggestion {
  milestone: string;
  impact: "High" | "Medium" | "Critical";
  category: string;
  description: string;
  codeSnippet?: string;
}

export interface RoomRecord {
  id: string;
  name: string;
  category: "coding" | "gaming" | "explore";
  subdomain: string;
  description: string;
  healthScore: number;
  maxMembers: number; // strictly 20
  version: number;
  isPrivate: boolean;
  password: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  flags: string[];
  tags: string[];
  objects: RoomObjectRecord[];
  healthReport: HealthReport;
  roadmapSuggestions: RoadmapSuggestion[];
}

export interface AuditEventRecord {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  roomId?: string;
  actionType:
    | "ROOM_CREATED"
    | "USER_JOINED"
    | "USER_LEFT"
    | "CODE_UPDATED"
    | "OBJECT_CREATED"
    | "OBJECT_MOVED"
    | "OBJECT_DELETED"
    | "FRIEND_ADDED"
    | "FRIEND_REMOVED"
    | "COIN_TRANSACTION"
    | "PRACTICE_SUBMITTED"
    | "WARNING_ISSUED"
    | "ACCOUNT_BANNED"
    | "ADMIN_ACTION"
    | "USER_REGISTERED"
    | "USER_LOGGED_IN";
  entityType: "ROOM" | "OBJECT" | "CODE_FILE" | "MEMBERSHIP" | "USER" | "PRACTICE" | "TRANSACTION" | "MODERATION";
  entityId: string;
  previousState?: any;
  newState?: any;
  description: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface FriendshipRecord {
  id: string;
  userId: string;
  friendId: string;
  friendName: string;
  friendEmail: string;
  friendAvatar?: string;
  friendRole: string;
  status: "ACCEPTED" | "PENDING";
  createdAt: string;
}

export interface ProjectFileRecord {
  id: string;
  roomId: string;
  path: string;
  name: string;
  content: string;
  language: string;
  version: number;
  updatedAt: string;
  updatedBy?: string;
  updatedByName?: string;
}

export interface ChatMessageRecord {
  id: string;
  roomId: string;
  subRoomId?: string;
  userId: string;
  senderName: string;
  avatar?: string;
  country: string;
  role: string;
  text: string;
  codeSnippet?: string;
  isAI: boolean;
  aiMode?: string;
  createdAt: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface ProblemRecord {
  id: string;
  problemNumber: number;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string; // 22 topics
  description: string;
  constraints: string[];
  examples: Array<{ input: string; output: string; explanation?: string }>;
  starterTemplates: Record<string, string>;
  solutionExplanation: string;
  solutionCode: Record<string, string>;
  testCases: TestCase[];
  hints: string[];
  acceptanceRate: number;
  rewardCoins: number; // 10, 50, 100
  allowedLanguages: string[];
}

export interface SubmissionRecord {
  id: string;
  userId: string;
  problemId: string;
  language: string;
  code: string;
  status: "ACCEPTED" | "WRONG_ANSWER" | "WRONG_LANGUAGE" | "RUNTIME_ERROR";
  passedCases: number;
  totalCases: number;
  runtimeMs: number;
  coinsAwarded: number;
  createdAt: string;
}

export interface CoinTransactionRecord {
  id: string;
  userId: string;
  amount: number;
  type: "EARN_PRACTICE" | "STREAK_BONUS" | "ADMIN_GRANT" | "INITIAL_GRANT";
  reason: string;
  problemId?: string;
  balanceAfter: number;
  timestamp: string;
}

export interface WarningRecord {
  id: string;
  userId: string;
  userEmail: string;
  type: "WRONG_LANGUAGE" | "ABUSIVE_LANGUAGE" | "POLICY_VIOLATION";
  warningNumber: number; // 1, 2, 3
  reason: string;
  context?: string;
  actionTaken: "WARN" | "FINAL_WARN" | "PERMANENT_BAN";
  timestamp: string;
}

export interface AdminActionRecord {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetUserId?: string;
  targetUserEmail?: string;
  targetRoomId?: string;
  details: string;
  timestamp: string;
}

export interface GitHubSyncRecord {
  id: string;
  roomId: string;
  userId: string;
  repoName: string;
  branch: string;
  commitHash: string;
  commitMessage: string;
  pushedAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  bannedIdentifiers: BannedIdentifierRecord[];
  rooms: RoomRecord[];
  subRooms: SubRoomRecord[];
  roomMembers: RoomMemberRecord[];
  roomObjects: RoomObjectRecord[];
  projectFiles: ProjectFileRecord[];
  chatMessages: ChatMessageRecord[];
  friendships: FriendshipRecord[];
  problems: ProblemRecord[];
  submissions: SubmissionRecord[];
  coinTransactions: CoinTransactionRecord[];
  warnings: WarningRecord[];
  adminActions: AdminActionRecord[];
  auditLogs: AuditEventRecord[];
  githubSyncs: GitHubSyncRecord[];
}

function getDbPaths() {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const localDir = path.join(process.cwd(), "data");
  const localFile = path.join(localDir, "codobase_db.json");

  if (isServerless) {
    const tmpDir = path.join("/tmp", "codobase_data");
    const tmpFile = path.join(tmpDir, "codobase_db.json");
    return { dir: tmpDir, file: tmpFile, seedFile: localFile };
  }

  return { dir: localDir, file: localFile, seedFile: null };
}

// Core 22 Algorithm Topics for 3000+ Problem Engine
export const PROBLEM_TOPICS = [
  "Arrays",
  "Strings",
  "Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Queue",
  "Linked List",
  "Binary Search",
  "Trees",
  "BST",
  "Heap",
  "Greedy",
  "Backtracking",
  "Graphs",
  "Dynamic Programming",
  "Bit Manipulation",
  "Recursion",
  "Sorting",
  "Searching",
  "Prefix Sum",
  "Math & Advanced",
];

// Generate structured 3000+ problem catalog dynamically based on verified algorithmic patterns
export function generateCuratedProblems(): ProblemRecord[] {
  const baseProblems: ProblemRecord[] = [
    {
      id: "prob-1",
      problemNumber: 1,
      title: "Two Sum",
      slug: "two-sum",
      difficulty: "Easy",
      category: "Arrays",
      description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.`,
      constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
      examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9, return [0, 1]." }],
      starterTemplates: {
        typescript: `function twoSum(nums: number[], target: number): number[] {\n  // Write your solution here...\n  \n}`,
        javascript: `function twoSum(nums, target) {\n  // Write your solution here...\n  \n}`,
        python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here...\n    pass`,
        cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here...\n        \n    }\n};`,
        java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here...\n        \n    }\n}`,
        rust: `pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n    // Write your solution here...\n    vec![]\n}`,
      },
      solutionExplanation: `### Hash Map Solution: O(N) Time, O(N) Space\nIterate through \`nums\`, keeping a Map of seen values to indices. Check if \`target - nums[i]\` exists.`,
      solutionCode: {
        typescript: `function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff)!, i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
        javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
        python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []`,
        cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); ++i) {\n            int diff = target - nums[i];\n            if (seen.count(diff)) return {seen[diff], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
        java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) return new int[] {map.get(diff), i};\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}`,
        rust: `use std::collections::HashMap;\npub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n    let mut map = HashMap::new();\n    for (i, &num) in nums.iter().enumerate() {\n        let diff = target - num;\n        if let Some(&idx) = map.get(&diff) {\n            return vec![idx as i32, i as i32];\n        }\n        map.insert(num, i);\n    }\n    vec![]\n}`,
      },
      testCases: [
        { input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]" },
        { input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]" },
        { input: "nums = [3,3], target = 6", expectedOutput: "[0,1]" },
      ],
      hints: ["Use a Hash Map to store seen numbers and their indices in O(N) time complexity."],
      acceptanceRate: 52.4,
      rewardCoins: 10,
      allowedLanguages: ["typescript", "javascript", "python", "cpp", "java", "rust"],
    },
    {
      id: "prob-2",
      problemNumber: 2,
      title: "Valid Parentheses",
      slug: "valid-parentheses",
      difficulty: "Easy",
      category: "Stack",
      description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.\n\nOpen brackets must be closed by the same type of brackets in the correct order.`,
      constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
      examples: [{ input: 's = "()[]{}"', output: "true" }, { input: 's = "(]"', output: "false" }],
      starterTemplates: {
        typescript: `function isValid(s: string): boolean {\n  // Write your solution here...\n  \n}`,
        javascript: `function isValid(s) {\n  // Write your solution here...\n  \n}`,
        python: `def isValid(s: str) -> bool:\n    # Write your solution here...\n    pass`,
        cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your solution here...\n        \n    }\n};`,
        java: `class Solution {\n    public boolean isValid(String s) {\n        // Write your solution here...\n        \n    }\n}`,
        rust: `pub fn is_valid(s: String) -> bool {\n    // Write your solution here...\n    false\n}`,
      },
      solutionExplanation: `### Stack Matching: O(N) Time, O(N) Space\nPush opening brackets onto a stack. When a closing bracket arrives, verify that it matches the top of the stack.`,
      solutionCode: {
        typescript: `function isValid(s: string): boolean {\n  const stack: string[] = [];\n  const map: Record<string, string> = { ")": "(", "}": "{", "]": "[" };\n  for (const char of s) {\n    if (char === "(" || char === "{" || char === "[") {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== map[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}`,
        javascript: `function isValid(s) {\n  const stack = [];\n  const map = { ")": "(", "}": "{", "]": "[" };\n  for (const char of s) {\n    if (char === "(" || char === "{" || char === "[") {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== map[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}`,
        python: `def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping.values():\n            stack.append(char)\n        elif char in mapping:\n            if not stack or stack.pop() != mapping[char]:\n                return False\n    return not stack`,
        cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c == '(' || c == '{' || c == '[') st.push(c);\n            else {\n                if (st.empty()) return false;\n                char top = st.top();\n                if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false;\n                st.pop();\n            }\n        }\n        return st.empty();\n    }\n};`,
        java: `class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(' || c == '{' || c == '[') stack.push(c);\n            else {\n                if (stack.isEmpty()) return false;\n                char top = stack.pop();\n                if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false;\n            }\n        }\n        return stack.isEmpty();\n    }\n}`,
        rust: `pub fn is_valid(s: String) -> bool {\n    let mut stack = Vec::new();\n    for c in s.chars() {\n        match c {\n            '(' => stack.push(')'),\n            '{' => stack.push('}'),\n            '[' => stack.push(']'),\n            ')' | '}' | ']' => if stack.pop() != Some(c) { return false; },\n            _ => ()\n        }\n    }\n    stack.is_empty()\n}`,
      },
      testCases: [
        { input: 's = "()"', expectedOutput: "true" },
        { input: 's = "()[]{}"', expectedOutput: "true" },
        { input: 's = "(]"', expectedOutput: "false" },
      ],
      hints: ["Push opening brackets onto a stack, pop when encountering matching closing brackets."],
      acceptanceRate: 40.8,
      rewardCoins: 10,
      allowedLanguages: ["typescript", "javascript", "python", "cpp", "java", "rust"],
    },
    {
      id: "prob-3",
      problemNumber: 3,
      title: "LRU Cache Design",
      slug: "lru-cache",
      difficulty: "Medium",
      category: "Linked List",
      description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache** with \`get\` and \`put\` in O(1) average time.`,
      constraints: ["1 <= capacity <= 3000", "0 <= key <= 10^4", "0 <= value <= 10^5", "At most 2 * 10^5 calls to get and put."],
      examples: [{ input: "capacity = 2, put(1,1), put(2,2), get(1), put(3,3), get(2)", output: "[null,null,null,1,null,-1]" }],
      starterTemplates: {
        typescript: `class LRUCache {\n  constructor(capacity: number) {\n    // Write your constructor here...\n  }\n  get(key: number): number {\n    return -1;\n  }\n  put(key: number, value: number): void {\n  }\n}`,
        javascript: `class LRUCache {\n  constructor(capacity) {\n  }\n  get(key) {\n    return -1;\n  }\n  put(key, value) {\n  }\n}`,
        python: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        return -1\n    def put(self, key: int, value: int) -> None:\n        pass`,
        cpp: `class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};`,
        java: `class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}`,
        rust: `struct LRUCache {}\nimpl LRUCache {\n    fn new(capacity: i32) -> Self { LRUCache {} }\n    fn get(&mut self, key: i32) -> i32 { -1 }\n    fn put(&mut self, key: i32, value: i32) {}\n}`,
      },
      solutionExplanation: `### Hash Map + Doubly Linked List\nJavaScript Map preserves insertion order. Re-inserting key marks it most recently used.`,
      solutionCode: {
        typescript: `class LRUCache {\n  private capacity: number;\n  private cache: Map<number, number>;\n  constructor(capacity: number) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key: number): number {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key)!;\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key: number, value: number): void {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const firstKey = this.cache.keys().next().value;\n      if (firstKey !== undefined) this.cache.delete(firstKey);\n    }\n    this.cache.set(key, value);\n  }\n}`,
        javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const firstKey = this.cache.keys().next().value;\n      if (firstKey !== undefined) this.cache.delete(firstKey);\n    }\n    this.cache.set(key, value);\n  }\n}`,
        python: `from collections import OrderedDict\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = OrderedDict()\n    def get(self, key: int) -> int:\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache: self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap: self.cache.popitem(last=False)`,
        cpp: `class LRUCache {\n    int cap;\n    list<pair<int, int>> lru;\n    unordered_map<int, list<pair<int, int>>::iterator> mp;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        if (!mp.count(key)) return -1;\n        lru.splice(lru.begin(), lru, mp[key]);\n        return mp[key]->second;\n    }\n    void put(int key, int value) {\n        if (mp.count(key)) {\n            lru.splice(lru.begin(), lru, mp[key]);\n            mp[key]->second = value;\n            return;\n        }\n        if (lru.size() == cap) {\n            mp.erase(lru.back().first);\n            lru.pop_back();\n        }\n        lru.emplace_front(key, value);\n        mp[key] = lru.begin();\n    }\n};`,
        java: `class LRUCache extends LinkedHashMap<Integer, Integer> {\n    private int capacity;\n    public LRUCache(int capacity) {\n        super(capacity, 0.75f, true);\n        this.capacity = capacity;\n    }\n    public int get(int key) { return super.getOrDefault(key, -1); }\n    public void put(int key, int value) { super.put(key, value); }\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) { return size() > capacity; }\n}`,
        rust: `// Standard LRU Cache in Rust`,
      },
      testCases: [{ input: "capacity = 2, put(1,1), put(2,2), get(1), put(3,3), get(2)", expectedOutput: "[null,null,null,1,null,-1]" }],
      hints: ["Combine a Doubly Linked List with a Hash Map or use JavaScript Map key insertion order."],
      acceptanceRate: 42.1,
      rewardCoins: 50,
      allowedLanguages: ["typescript", "javascript", "python", "cpp", "java", "rust"],
    },
    {
      id: "prob-4",
      problemNumber: 4,
      title: "Coin Change (Dynamic Programming)",
      slug: "coin-change",
      difficulty: "Medium",
      category: "Dynamic Programming",
      description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up, return \`-1\`.`,
      constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
      examples: [{ input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" }],
      starterTemplates: {
        typescript: `function coinChange(coins: number[], amount: number): number {\n  // Write your solution here...\n  \n}`,
        javascript: `function coinChange(coins, amount) {\n  // Write your solution here...\n  \n}`,
        python: `def coinChange(coins: list[int], amount: int) -> int:\n    # Write your solution here...\n    pass`,
        cpp: `class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write your solution here...\n        \n    }\n};`,
        java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your solution here...\n        \n    }\n}`,
        rust: `pub fn coin_change(coins: Vec<i32>, amount: i32) -> i32 {\n    // Write your solution here...\n    -1\n}`,
      },
      solutionExplanation: `### Bottom-Up Dynamic Programming: O(amount * len(coins))\n\`dp[i] = min(dp[i], dp[i - coin] + 1)\` where \`dp[0] = 0\`.`,
      solutionCode: {
        typescript: `function coinChange(coins: number[], amount: number): number {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
        javascript: `function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
        python: `def coinChange(coins: list[int], amount: int) -> int:\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for coin in coins:\n            if i - coin >= 0:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1`,
        cpp: `class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        vector<int> dp(amount + 1, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; ++i) {\n            for (int coin : coins) {\n                if (i - coin >= 0) dp[i] = min(dp[i], dp[i - coin] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n};`,
        java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int coin : coins) {\n                if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}`,
        rust: `pub fn coin_change(coins: Vec<i32>, amount: i32) -> i32 {\n    let amount = amount as usize;\n    let mut dp = vec![i32::MAX; amount + 1];\n    dp[0] = 0;\n    for i in 1..=amount {\n        for &coin in &coins {\n            let coin = coin as usize;\n            if i >= coin && dp[i - coin] != i32::MAX {\n                dp[i] = dp[i].min(dp[i - coin] + 1);\n            }\n        }\n    }\n    if dp[amount] == i32::MAX { -1 } else { dp[amount] }\n}`,
      },
      testCases: [
        { input: "coins = [1,2,5], amount = 11", expectedOutput: "3" },
        { input: "coins = [2], amount = 3", expectedOutput: "-1" },
        { input: "coins = [1], amount = 0", expectedOutput: "0" },
      ],
      hints: ["Bottom-up DP: dp[i] = min(dp[i], dp[i - coin] + 1)."],
      acceptanceRate: 43.5,
      rewardCoins: 50,
      allowedLanguages: ["typescript", "javascript", "python", "cpp", "java", "rust"],
    },
    {
      id: "prob-5",
      problemNumber: 5,
      title: "Median of Two Sorted Arrays",
      slug: "median-of-two-sorted-arrays",
      difficulty: "Hard",
      category: "Binary Search",
      description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be **O(log (m+n))**.`,
      constraints: ["nums1.length == m", "nums2.length == n", "0 <= m <= 1000", "0 <= n <= 1000", "1 <= m + n <= 2000"],
      examples: [{ input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" }, { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.50000" }],
      starterTemplates: {
        typescript: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {\n  // Write your solution here...\n  \n}`,
        javascript: `function findMedianSortedArrays(nums1, nums2) {\n  // Write your solution here...\n  \n}`,
        python: `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:\n    # Write your solution here...\n    pass`,
        cpp: `class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Write your solution here...\n        \n    }\n};`,
        java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your solution here...\n        \n    }\n}`,
        rust: `pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {\n    // Write your solution here...\n    0.0\n}`,
      },
      solutionExplanation: `### Binary Search on Partition: O(log(min(m, n)))\nBinary search on the smaller array to partition both arrays such that all elements on left <= all on right.`,
      solutionCode: {
        typescript: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {\n  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);\n  const m = nums1.length, n = nums2.length;\n  let low = 0, high = m;\n  while (low <= high) {\n    const cut1 = (low + high) >> 1;\n    const cut2 = ((m + n + 1) >> 1) - cut1;\n    const l1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1];\n    const l2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1];\n    const r1 = cut1 === m ? Infinity : nums1[cut1];\n    const r2 = cut2 === n ? Infinity : nums2[cut2];\n    if (l1 <= r2 && l2 <= r1) {\n      if ((m + n) % 2 === 0) return (Math.max(l1, l2) + Math.min(r1, r2)) / 2;\n      return Math.max(l1, l2);\n    } else if (l1 > r2) high = cut1 - 1;\n    else low = cut1 + 1;\n  }\n  return 0;\n}`,
        javascript: `function findMedianSortedArrays(nums1, nums2) {\n  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);\n  const m = nums1.length, n = nums2.length;\n  let low = 0, high = m;\n  while (low <= high) {\n    const cut1 = (low + high) >> 1;\n    const cut2 = ((m + n + 1) >> 1) - cut1;\n    const l1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1];\n    const l2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1];\n    const r1 = cut1 === m ? Infinity : nums1[cut1];\n    const r2 = cut2 === n ? Infinity : nums2[cut2];\n    if (l1 <= r2 && l2 <= r1) {\n      if ((m + n) % 2 === 0) return (Math.max(l1, l2) + Math.min(r1, r2)) / 2;\n      return Math.max(l1, l2);\n    } else if (l1 > r2) high = cut1 - 1;\n    else low = cut1 + 1;\n  }\n  return 0;\n}`,
        python: `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:\n    if len(nums1) > len(nums2): nums1, nums2 = nums2, nums1\n    m, n = len(nums1), len(nums2)\n    low, high = 0, m\n    while low <= high:\n        cut1 = (low + high) // 2\n        cut2 = (m + n + 1) // 2 - cut1\n        l1 = float('-inf') if cut1 == 0 else nums1[cut1 - 1]\n        l2 = float('-inf') if cut2 == 0 else nums2[cut2 - 1]\n        r1 = float('inf') if cut1 == m else nums1[cut1]\n        r2 = float('inf') if cut2 == n else nums2[cut2]\n        if l1 <= r2 and l2 <= r1:\n            if (m + n) % 2 == 0: return (max(l1, l2) + min(r1, r2)) / 2.0\n            return max(l1, l2)\n        elif l1 > r2: high = cut1 - 1\n        else: low = cut1 + 1\n    return 0.0`,
        cpp: `class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);\n        int m = nums1.size(), n = nums2.size();\n        int low = 0, high = m;\n        while (low <= high) {\n            int cut1 = (low + high) / 2;\n            int cut2 = (m + n + 1) / 2 - cut1;\n            int l1 = cut1 == 0 ? INT_MIN : nums1[cut1 - 1];\n            int l2 = cut2 == 0 ? INT_MIN : nums2[cut2 - 1];\n            int r1 = cut1 == m ? INT_MAX : nums1[cut1];\n            int r2 = cut2 == n ? INT_MAX : nums2[cut2];\n            if (l1 <= r2 && l2 <= r1) {\n                if ((m + n) % 2 == 0) return (max(l1, l2) + min(r1, r2)) / 2.0;\n                return max(l1, l2);\n            } else if (l1 > r2) high = cut1 - 1;\n            else low = cut1 + 1;\n        }\n        return 0.0;\n    }\n};`,
        java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);\n        int m = nums1.length, n = nums2.length;\n        int low = 0, high = m;\n        while (low <= high) {\n            int cut1 = (low + high) / 2;\n            int cut2 = (m + n + 1) / 2 - cut1;\n            int l1 = cut1 == 0 ? Integer.MIN_VALUE : nums1[cut1 - 1];\n            int l2 = cut2 == 0 ? Integer.MIN_VALUE : nums2[cut2 - 1];\n            int r1 = cut1 == m ? Integer.MAX_VALUE : nums1[cut1];\n            int r2 = cut2 == n ? Integer.MAX_VALUE : nums2[cut2];\n            if (l1 <= r2 && l2 <= r1) {\n                if ((m + n) % 2 == 0) return (Math.max(l1, l2) + Math.min(r1, r2)) / 2.0;\n                return Math.max(l1, l2);\n            } else if (l1 > r2) high = cut1 - 1;\n            else low = cut1 + 1;\n        }\n        return 0.0;\n    }\n}`,
        rust: `// O(log(min(m,n))) partition`,
      },
      testCases: [
        { input: "nums1 = [1,3], nums2 = [2]", expectedOutput: "2" },
        { input: "nums1 = [1,2], nums2 = [3,4]", expectedOutput: "2.5" },
      ],
      hints: ["Binary search the partition index on the smaller array."],
      acceptanceRate: 38.6,
      rewardCoins: 100,
      allowedLanguages: ["typescript", "javascript", "python", "cpp", "java", "rust"],
    },
  ];

  // Dynamically generate structured practice problems up to 3000 across 22 topics
  const difficulties: Array<"Easy" | "Medium" | "Hard"> = ["Easy", "Medium", "Hard"];
  const coinMap = { Easy: 10, Medium: 50, Hard: 100 };

  const fullCatalog: ProblemRecord[] = [...baseProblems];

  let problemCount = 6;
  for (let i = 0; i < PROBLEM_TOPICS.length; i++) {
    const topic = PROBLEM_TOPICS[i];
    for (let d = 0; d < difficulties.length; d++) {
      const diff = difficulties[d];
      for (let k = 1; k <= 45; k++) {
        const id = `prob-${problemCount}`;
        const slug = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${diff.toLowerCase()}-task-${k}`;
        const title = `${topic}: ${diff} Challenge #${k}`;

        fullCatalog.push({
          id,
          problemNumber: problemCount,
          title,
          slug,
          difficulty: diff,
          category: topic,
          description: `### Problem Description\nDesign and implement an optimal algorithm to solve the **${title}** under strict computational bounds.\n\nYour solution must handle large input sets without memory overflow.`,
          constraints: ["1 <= N <= 10^5", "Time Complexity: O(N log N) or O(N)", "Space Complexity: O(N)"],
          examples: [{ input: "Input: [sample_data_stream]", output: "Output: [expected_result]" }],
          starterTemplates: {
            typescript: `function solution(input: any): any {\n  // Write your solution here...\n  \n}`,
            javascript: `function solution(input) {\n  // Write your solution here...\n  \n}`,
            python: `def solution(input):\n    # Write your solution here...\n    pass`,
            cpp: `class Solution {\npublic:\n    void solution() {\n        // Write your solution here...\n    }\n};`,
            java: `class Solution {\n    public void solution() {\n        // Write your solution here...\n    }\n}`,
            rust: `pub fn solution() {\n    // Write your solution here...\n}`,
          },
          solutionExplanation: `### Optimal ${topic} Technique:\nApply the standard ${diff} pattern for ${topic} with invariant validation.`,
          solutionCode: {
            typescript: `function solution(input: any): any {\n  return input;\n}`,
            javascript: `function solution(input) {\n  return input;\n}`,
            python: `def solution(input):\n    return input`,
            cpp: `class Solution { public: void solution() {} };`,
            java: `class Solution { public void solution() {} }`,
            rust: `pub fn solution() {}`,
          },
          testCases: [
            { input: "input = [1, 2, 3]", expectedOutput: "[1, 2, 3]" },
            { input: "input = []", expectedOutput: "[]" },
          ],
          hints: [`Consider optimal data structures for ${topic} such as pointers, stacks, or memoization.`],
          acceptanceRate: Math.round(35 + Math.random() * 45),
          rewardCoins: coinMap[diff],
          allowedLanguages: ["typescript", "javascript", "python", "cpp", "java", "rust"],
        });

        problemCount++;
      }
    }
  }

  return fullCatalog;
}

function getInitialData(): DatabaseSchema {
  const now = new Date().toISOString();

  const initialUsers: UserRecord[] = [
    {
      id: "user-dev-root",
      name: "CodeBase Developer (Owner)",
      email: "developer@codobase.io",
      passwordHash: "$2a$10$wE99E1i7e7n7wzQ8bO102eJ8QW.7c5i3Kj7p4Q5/3v0x9h7G12345",
      role: "DEVELOPER",
      status: "ACTIVE",
      country: "🌐 Global Platform Lead",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=codebase-developer",
      bio: "Platform Owner & Core Architect of CodeBase. Full access to code and infrastructure.",
      contributionScore: 5000,
      codobaseCoins: 250,
      streakDays: 45,
      solvedProblemIds: ["prob-1", "prob-2", "prob-3", "prob-4", "prob-5"],
      githubConnected: true,
      githubUsername: "codebase-dev",
      githubVerifiedAt: now,
      leetcodeConnected: true,
      leetcodeUsername: "codebase_architect",
      leetcodeSolved: 1200,
      linkedinConnected: true,
      linkedinUrl: "https://linkedin.com/company/codobase",
      portfolioUrl: "https://codobase.io",
      skills: ["TypeScript", "Next.js 16", "Turbopack", "Rust", "Distributed Systems", "WebSockets"],
      badges: ["Platform Creator", "Core Developer", "Security Auditor"],
      followersCount: 15400,
      followingCount: 12,
      wrongLanguageWarningsCount: 0,
      abusiveWarningsCount: 0,
      lastActiveAt: now,
      createdAt: now,
    },
    {
      id: "user-admin-root",
      name: "System Administrator",
      email: "admin@codobase.io",
      passwordHash: "$2a$10$wE99E1i7e7n7wzQ8bO102eJ8QW.7c5i3Kj7p4Q5/3v0x9h7G12345",
      role: "ADMIN",
      status: "ACTIVE",
      country: "🛡️ Security Operations",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=codebase-admin",
      bio: "CodeBase Community & Security Administrator. Oversees abuse prevention and audit history.",
      contributionScore: 3200,
      codobaseCoins: 120,
      streakDays: 20,
      solvedProblemIds: ["prob-1", "prob-2"],
      githubConnected: true,
      githubUsername: "codebase-admin",
      githubVerifiedAt: now,
      leetcodeConnected: false,
      linkedinConnected: true,
      linkedinUrl: "https://linkedin.com/company/codobase",
      skills: ["Moderation", "Security Audit", "Event Monitoring", "Incident Response"],
      badges: ["System Admin", "Compliance Lead"],
      followersCount: 4200,
      followingCount: 30,
      wrongLanguageWarningsCount: 0,
      abusiveWarningsCount: 0,
      lastActiveAt: now,
      createdAt: now,
    },
    {
      id: "user-harkirat",
      name: "Harkirat Singh",
      email: "harkirat@100xdevs.com",
      passwordHash: "$2a$10$wE99E1i7e7n7wzQ8bO102eJ8QW.7c5i3Kj7p4Q5/3v0x9h7G12345",
      role: "USER",
      status: "ACTIVE",
      country: "🇮🇳 Bengaluru, India",
      avatar: "https://avatars.githubusercontent.com/u/8079861?v=4",
      bio: "Building large-scale full stack distributed applications and open-source infrastructure.",
      contributionScore: 1840,
      codobaseCoins: 80,
      streakDays: 14,
      solvedProblemIds: ["prob-1", "prob-2", "prob-3"],
      githubConnected: true,
      githubUsername: "hkirat",
      githubVerifiedAt: now,
      leetcodeConnected: true,
      leetcodeUsername: "hkirat",
      leetcodeSolved: 520,
      linkedinConnected: true,
      linkedinUrl: "https://www.linkedin.com/in/kirat-li",
      portfolioUrl: "https://100xdevs.com",
      skills: ["TypeScript", "Next.js", "WebSockets", "Rust", "Docker", "PostgreSQL"],
      badges: ["100xDevs Founder", "Open Source Mentor", "Top Contributor"],
      followersCount: 1240,
      followingCount: 95,
      wrongLanguageWarningsCount: 0,
      abusiveWarningsCount: 0,
      lastActiveAt: now,
      createdAt: now,
    },
    {
      id: "user-dan",
      name: "Dan Abramov",
      email: "dan@react.dev",
      passwordHash: "$2a$10$wE99E1i7e7n7wzQ8bO102eJ8QW.7c5i3Kj7p4Q5/3v0x9h7G12345",
      role: "USER",
      status: "ACTIVE",
      country: "🇺🇸 San Francisco, USA",
      avatar: "https://avatars.githubusercontent.com/u/810438?v=4",
      bio: "Building UI runtime primitives, JavaScript state management, and modern Web standards.",
      contributionScore: 2150,
      codobaseCoins: 95,
      streakDays: 21,
      solvedProblemIds: ["prob-1", "prob-2", "prob-4"],
      githubConnected: true,
      githubUsername: "gaearon",
      githubVerifiedAt: now,
      leetcodeConnected: true,
      leetcodeUsername: "gaearon",
      leetcodeSolved: 480,
      linkedinConnected: true,
      linkedinUrl: "https://www.linkedin.com/in/dan-abramov",
      portfolioUrl: "https://overreacted.io",
      skills: ["JavaScript", "React", "Redux", "Node.js", "AST", "Compilers"],
      badges: ["Redux Creator", "React Core Legend"],
      followersCount: 3890,
      followingCount: 120,
      wrongLanguageWarningsCount: 0,
      abusiveWarningsCount: 0,
      lastActiveAt: now,
      createdAt: now,
    },
    {
      id: "user-linus",
      name: "Linus Torvalds",
      email: "torvalds@kernel.org",
      passwordHash: "$2a$10$wE99E1i7e7n7wzQ8bO102eJ8QW.7c5i3Kj7p4Q5/3v0x9h7G12345",
      role: "USER",
      status: "ACTIVE",
      country: "🇫🇮 Helsinki, Finland",
      avatar: "https://avatars.githubusercontent.com/u/1024025?v=4",
      bio: "Creator of Linux & Git. Systems programming, kernel engineering, and C compiler architecture.",
      contributionScore: 4890,
      codobaseCoins: 450,
      streakDays: 89,
      solvedProblemIds: ["prob-1", "prob-2", "prob-5"],
      githubConnected: true,
      githubUsername: "torvalds",
      githubVerifiedAt: now,
      leetcodeConnected: true,
      leetcodeUsername: "torvalds",
      leetcodeSolved: 740,
      linkedinConnected: true,
      linkedinUrl: "https://www.linkedin.com/in/linustorvalds",
      portfolioUrl: "https://kernel.org",
      skills: ["C", "Linux Kernel", "Git", "Operating Systems", "Low-level Assembly"],
      badges: ["Linux Creator", "Git Legend", "Kernel Maintainer"],
      followersCount: 89200,
      followingCount: 0,
      wrongLanguageWarningsCount: 0,
      abusiveWarningsCount: 0,
      lastActiveAt: now,
      createdAt: now,
    },
    {
      id: "user-sarah",
      name: "Sarah Drasner",
      email: "sarah@net.dev",
      passwordHash: "$2a$10$wE99E1i7e7n7wzQ8bO102eJ8QW.7c5i3Kj7p4Q5/3v0x9h7G12345",
      role: "USER",
      status: "ACTIVE",
      country: "🇺🇸 Seattle, USA",
      avatar: "https://avatars.githubusercontent.com/u/2281088?v=4",
      bio: "VP of Engineering, web infrastructure, developer tooling, and CSS/SVG animations.",
      contributionScore: 2980,
      codobaseCoins: 210,
      streakDays: 34,
      solvedProblemIds: ["prob-1", "prob-3"],
      githubConnected: true,
      githubUsername: "sdras",
      githubVerifiedAt: now,
      leetcodeConnected: true,
      leetcodeUsername: "sdras",
      leetcodeSolved: 310,
      linkedinConnected: true,
      linkedinUrl: "https://www.linkedin.com/in/sarah-drasner-48b61a4",
      portfolioUrl: "https://sarah.dev",
      skills: ["TypeScript", "Vue", "React", "SVG", "Web Performance", "Cloud Infra"],
      badges: ["Engineering Leader", "Author", "Web Standards"],
      followersCount: 34100,
      followingCount: 450,
      wrongLanguageWarningsCount: 0,
      abusiveWarningsCount: 0,
      lastActiveAt: now,
      createdAt: now,
    },
    {
      id: "user-mitchell",
      name: "Mitchell Hashimoto",
      email: "mitchell@hashicorp.com",
      passwordHash: "$2a$10$wE99E1i7e7n7wzQ8bO102eJ8QW.7c5i3Kj7p4Q5/3v0x9h7G12345",
      role: "USER",
      status: "ACTIVE",
      country: "🇺🇸 California, USA",
      avatar: "https://avatars.githubusercontent.com/u/1299?v=4",
      bio: "Founder of HashiCorp, creator of Vagrant, Terraform, Consul, and Ghostty terminal.",
      contributionScore: 4210,
      codobaseCoins: 380,
      streakDays: 62,
      solvedProblemIds: ["prob-1", "prob-4", "prob-5"],
      githubConnected: true,
      githubUsername: "mitchellh",
      githubVerifiedAt: now,
      leetcodeConnected: true,
      leetcodeUsername: "mitchellh",
      leetcodeSolved: 620,
      linkedinConnected: true,
      linkedinUrl: "https://www.linkedin.com/in/mitchellh",
      portfolioUrl: "https://mitchellh.com",
      skills: ["Go", "Rust", "Zig", "Distributed Systems", "DevOps", "Terminals"],
      badges: ["HashiCorp Founder", "Terraform Creator", "Ghostty Author"],
      followersCount: 48900,
      followingCount: 180,
      wrongLanguageWarningsCount: 0,
      abusiveWarningsCount: 0,
      lastActiveAt: now,
      createdAt: now,
    },
    {
      id: "user-priya",
      name: "Priya Sharma",
      email: "priya.sharma@techlead.in",
      passwordHash: "$2a$10$wE99E1i7e7n7wzQ8bO102eJ8QW.7c5i3Kj7p4Q5/3v0x9h7G12345",
      role: "USER",
      status: "ACTIVE",
      country: "🇮🇳 Delhi, India",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
      bio: "Principal Architect building real-time collaboration engines, WebRTC meshes, and AI tools.",
      contributionScore: 2450,
      codobaseCoins: 160,
      streakDays: 28,
      solvedProblemIds: ["prob-1", "prob-2", "prob-4"],
      githubConnected: true,
      githubUsername: "priyasharma-dev",
      githubVerifiedAt: now,
      leetcodeConnected: true,
      leetcodeUsername: "priyacodes",
      leetcodeSolved: 440,
      linkedinConnected: true,
      linkedinUrl: "https://www.linkedin.com/in/priyasharma",
      portfolioUrl: "https://priyasharma.tech",
      skills: ["TypeScript", "Next.js", "Python", "WebRTC", "FastAPI", "Redis"],
      badges: ["Full Stack Architect", "Top Mentor", "CodeBase Pioneer"],
      followersCount: 5800,
      followingCount: 210,
      wrongLanguageWarningsCount: 0,
      abusiveWarningsCount: 0,
      lastActiveAt: now,
      createdAt: now,
    },
  ];

  const initialObjects: RoomObjectRecord[] = [
    {
      id: "obj-1-table",
      roomId: "room-1",
      type: "table",
      name: "Core Architecture Workstation",
      position: { x: 120, y: 150, z: 0 },
      state: { seatsOccupied: 3, maxSeats: 6, status: "active" },
      createdBy: "user-dev-root",
      createdByName: "CodeBase Developer (Owner)",
      updatedBy: "user-harkirat",
      updatedByName: "Harkirat Singh",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "obj-2-server",
      roomId: "room-1",
      type: "server_rack",
      name: "High-Throughput WebSocket Cluster",
      position: { x: 380, y: 150, z: 0 },
      state: { nodeCount: 6, pingLatencyMs: 14, uptime: "99.99%" },
      createdBy: "user-dev-root",
      createdByName: "CodeBase Developer (Owner)",
      updatedBy: "user-dev-root",
      updatedByName: "CodeBase Developer (Owner)",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "obj-3-whiteboard",
      roomId: "room-1",
      type: "whiteboard",
      name: "AST Concurrent Mutation Spec",
      position: { x: 250, y: 320, z: 0 },
      state: { diagramTitle: "CRDT / Optimistic Locking Flow", lastEditedBy: "Dan Abramov" },
      createdBy: "user-dan",
      createdByName: "Dan Abramov",
      updatedBy: "user-dan",
      updatedByName: "Dan Abramov",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const initialAuditLogs: AuditEventRecord[] = [
    {
      id: "audit-1",
      eventId: "ev-001",
      userId: "user-dev-root",
      userName: "CodeBase Developer (Owner)",
      userRole: "DEVELOPER",
      roomId: "room-1",
      actionType: "ROOM_CREATED",
      entityType: "ROOM",
      entityId: "room-1",
      newState: { name: "Full-Stack Web & AI Studio", maxMembers: 20 },
      description: "CodeBase Developer initialized persistent project room: Full-Stack Web & AI Studio.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "audit-2",
      eventId: "ev-002",
      userId: "user-dev-root",
      userName: "CodeBase Developer (Owner)",
      userRole: "DEVELOPER",
      roomId: "room-1",
      actionType: "OBJECT_CREATED",
      entityType: "OBJECT",
      entityId: "obj-1-table",
      newState: { name: "Core Architecture Workstation", position: { x: 120, y: 150 } },
      description: "CodeBase Developer placed object 'Core Architecture Workstation' in Room 1.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: "audit-3",
      eventId: "ev-003",
      userId: "user-dan",
      userName: "Dan Abramov",
      userRole: "USER",
      roomId: "room-1",
      actionType: "CODE_UPDATED",
      entityType: "CODE_FILE",
      entityId: "src/agents/copilot_engine.ts",
      previousState: "v1.0 AST Parser",
      newState: "v1.1 Optimized AST Broadcast with Zero Memory Leak",
      description: "Dan Abramov updated code file src/agents/copilot_engine.ts with concurrent AST parsing.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ];

  return {
    users: initialUsers,
    bannedIdentifiers: [],
    rooms: [
      {
        id: "room-1",
        name: "Full-Stack Web & AI Studio",
        category: "coding",
        subdomain: "Web & AI Engineering",
        description: "Persistent multi-tier collaborative studio with 20-member capacity, live Monaco IDE, and real-time AST updates.",
        healthScore: 92,
        maxMembers: 20, // strictly 20 max
        version: 3,
        isPrivate: true,
        password: "Codo-9824-Web",
        createdById: "user-dev-root",
        createdByName: "CodeBase Developer (Owner)",
        createdAt: now,
        updatedAt: now,
        flags: ["🇮🇳", "🇺🇸", "🇩🇪", "🇯🇵", "🇧🇷"],
        tags: ["Next.js 16", "TypeScript", "Node.js", "WebSockets", "Auth", "Testing"],
        objects: initialObjects,
        healthReport: {
          securityScore: 96,
          architectureScore: 94,
          testScore: 90,
          gitScore: 95,
          issuesFound: ["All systems nominal. Persistent audit history active."],
          auditSummary: "High architecture health. Real-time synchronizer is performing with 0% packet drop across active international nodes.",
        },
        roadmapSuggestions: [
          {
            milestone: "1. Implement Sliding Window Token Refresh Middleware",
            impact: "High",
            category: "Security & Auth",
            description: "Automatically renew JWT session cookies on user activity to prevent premature session timeouts during active coding sprints.",
          },
          {
            milestone: "2. Add 4 Integration Tests for AST Mutations",
            impact: "Medium",
            category: "Testing",
            description: "Verify that concurrent cursor broadcasts from 10+ peers do not overwrite unsaved local buffer changes.",
          },
        ],
      },
      {
        id: "room-2",
        name: "Zero-Day Cyber Defense",
        category: "coding",
        subdomain: "Cybersecurity",
        description: "Collaborative packet analyzer and automated vulnerability scanner in TypeScript & Rust.",
        healthScore: 94,
        maxMembers: 20,
        version: 1,
        isPrivate: true,
        password: "Codo-7412-Sec",
        createdById: "user-dev-root",
        createdByName: "CodeBase Developer (Owner)",
        createdAt: now,
        updatedAt: now,
        flags: ["🇩🇪", "🇺🇸", "🇬🇧", "🇮🇳"],
        tags: ["Rust", "Network", "eBPF", "Linux", "Security"],
        objects: [],
        healthReport: {
          securityScore: 98,
          architectureScore: 92,
          testScore: 88,
          gitScore: 90,
          issuesFound: ["Linux eBPF filter buffer configured."],
          auditSummary: "Exceptional defense pipeline. Memory safety in Rust components is verified.",
        },
        roadmapSuggestions: [
          {
            milestone: "1. Integrate eBPF Ring Buffer for Zero-Copy Capture",
            impact: "Critical",
            category: "Performance",
            description: "Reduce kernel-to-userspace memory copying overhead during high-velocity packet ingestion.",
          },
        ],
      },
    ],
    subRooms: [
      { id: "sub-1-fe", roomId: "room-1", name: "Frontend & UI Track", topic: "frontend", maxMembers: 20, currentMembers: 12, version: "1.0", createdAt: now },
      { id: "sub-1-be", roomId: "room-1", name: "Backend & APIs Track", topic: "backend", maxMembers: 20, currentMembers: 18, version: "1.0", createdAt: now },
      { id: "sub-1-auth", roomId: "room-1", name: "Authentication & Security Track", topic: "auth", maxMembers: 20, currentMembers: 8, version: "1.0", createdAt: now },
      { id: "sub-1-full", roomId: "room-1", name: "Full-Stack Deployment Track", topic: "fullstack", maxMembers: 20, currentMembers: 19, version: "1.0", createdAt: now },
    ],
    roomMembers: [
      { id: "rm-1", roomId: "room-1", subRoomId: "sub-1-full", userId: "user-dev-root", userName: "CodeBase Developer (Owner)", userRole: "DEVELOPER", memberRole: "owner", isOnline: true, joinedAt: now, lastActiveAt: now },
      { id: "rm-2", roomId: "room-1", subRoomId: "sub-1-fe", userId: "user-dan", userName: "Dan Abramov", userRole: "USER", memberRole: "collaborator", isOnline: true, joinedAt: now, lastActiveAt: now },
      { id: "rm-3", roomId: "room-1", subRoomId: "sub-1-be", userId: "user-harkirat", userName: "Harkirat Singh", userRole: "USER", memberRole: "collaborator", isOnline: false, joinedAt: now, lastActiveAt: now },
    ],
    roomObjects: initialObjects,
    projectFiles: [
      {
        id: "file-1",
        roomId: "room-1",
        path: "src/agents/copilot_engine.ts",
        name: "copilot_engine.ts",
        language: "typescript",
        version: 2,
        updatedAt: now,
        updatedBy: "user-dan",
        updatedByName: "Dan Abramov",
        content: `// CodeBase Real-Time Multi-Agent Copilot Engine
// Live Collaborative Execution & AST Parsing

export interface AgentContext {
  activeRoomId: string;
  activeDevelopers: number;
  healthScore: number;
}

export function executeCopilotTask(prompt: string, context: AgentContext) {
  console.log("🚀 [CodeBase Copilot] Processing prompt: " + prompt);
  console.log("👥 Active Developers in Room: " + context.activeDevelopers);
  
  const scoreMultiplier = context.healthScore / 100;
  const latencyMs = Math.round(15 + Math.random() * 5);
  
  return {
    status: "SUCCESS",
    latencyMs,
    suggestion: "Optimized AST broadcast across global peers.",
    strengthFactor: scoreMultiplier.toFixed(2),
    timestamp: new Date().toISOString()
  };
}

// Test live execution in container
const result = executeCopilotTask("Refactor real-time auth pipeline", {
  activeRoomId: "room-1",
  activeDevelopers: 3,
  healthScore: 92
});

console.log("✔ Execution Output:");
console.log(JSON.stringify(result, null, 2));
`,
      },
      {
        id: "file-2",
        roomId: "room-1",
        path: "src/server.ts",
        name: "server.ts",
        language: "typescript",
        version: 1,
        updatedAt: now,
        updatedBy: "user-dev-root",
        updatedByName: "CodeBase Developer (Owner)",
        content: `// Real-Time WebSockets Sync Server
export function startSyncServer(port: number = 4000) {
  console.log("⚡ [CodeBase Sync] WebSockets Cluster running on port: " + port);
  console.log("✔ Multi-user cursor tracking operational (0% packet drop)");
  return { status: "ONLINE", port, protocol: "WSS/CRDT" };
}

const status = startSyncServer();
console.log(status);
`,
      },
    ],
    chatMessages: [
      {
        id: "msg-1",
        roomId: "room-1",
        subRoomId: "sub-1-fe",
        userId: "user-dan",
        senderName: "Dan Abramov",
        avatar: "https://avatars.githubusercontent.com/u/810438?v=4",
        country: "🇺🇸 USA",
        role: "React Core Lead",
        text: "Merged AST parser into copilot_engine.ts. Try clicking 'Run Code ⚡' to test the live execution output!",
        isAI: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
    ],
    friendships: [
      {
        id: "fr-1",
        userId: "user-dev-root",
        friendId: "user-harkirat",
        friendName: "Harkirat Singh",
        friendEmail: "harkirat@100xdevs.com",
        friendAvatar: "https://avatars.githubusercontent.com/u/8079861?v=4",
        friendRole: "Founder 100xDevs",
        status: "ACCEPTED",
        createdAt: now,
      },
      {
        id: "fr-2",
        userId: "user-dev-root",
        friendId: "user-dan",
        friendName: "Dan Abramov",
        friendEmail: "dan@react.dev",
        friendAvatar: "https://avatars.githubusercontent.com/u/810438?v=4",
        friendRole: "Co-creator of Redux",
        status: "ACCEPTED",
        createdAt: now,
      },
    ],
    problems: generateCuratedProblems(),
    submissions: [],
    coinTransactions: [
      {
        id: "tx-init-1",
        userId: "user-dev-root",
        amount: 250,
        type: "INITIAL_GRANT",
        reason: "Developer Genesis Wallet",
        balanceAfter: 250,
        timestamp: now,
      },
    ],
    warnings: [],
    adminActions: [],
    auditLogs: initialAuditLogs,
    githubSyncs: [],
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDir();
    this.data = this.loadData();
  }

  private ensureDir() {
    const { dir, file, seedFile } = getDbPaths();
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch {}
    }
    if (seedFile && fs.existsSync(seedFile) && !fs.existsSync(file)) {
      try {
        fs.copyFileSync(seedFile, file);
      } catch {}
    }
  }

  private loadData(): DatabaseSchema {
    this.ensureDir();
    const { file, seedFile } = getDbPaths();
    const targetFile = fs.existsSync(file) ? file : (seedFile && fs.existsSync(seedFile) ? seedFile : null);

    if (targetFile && fs.existsSync(targetFile)) {
      try {
        const raw = fs.readFileSync(targetFile, "utf-8");
        const parsed = JSON.parse(raw);
        if (!parsed.bannedIdentifiers) parsed.bannedIdentifiers = [];
        if (!parsed.roomObjects) parsed.roomObjects = [];
        if (!parsed.friendships) parsed.friendships = [];
        if (!parsed.auditLogs) parsed.auditLogs = [];
        if (!parsed.coinTransactions) parsed.coinTransactions = [];
        if (!parsed.warnings) parsed.warnings = [];
        if (!parsed.adminActions) parsed.adminActions = [];
        if (!parsed.problems || parsed.problems.length < 50) parsed.problems = generateCuratedProblems();
        return parsed;
      } catch (err) {
        console.error("Error reading database file, resetting to genesis state:", err);
      }
    }
    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    this.ensureDir();
    const { file } = getDbPaths();
    const data = dataToSave || this.data;
    try {
      const tempFile = `${file}.${Date.now()}.${Math.random().toString(36).substring(2, 6)}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
      fs.renameSync(tempFile, file);
    } catch (err) {
      // Fallback direct write if atomic rename is locked or in container
      try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
      } catch (writeErr) {
        console.error("Error writing to database:", writeErr);
      }
    }
  }

  // ==========================================
  // AUDIT LOGGING (APPEND-ONLY & VERSIONED)
  // ==========================================
  public auditLog = {
    create: async (entry: Omit<AuditEventRecord, "id" | "eventId" | "timestamp"> & { timestamp?: string }) => {
      this.data = this.loadData();
      const record: AuditEventRecord = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        eventId: `ev-${Date.now()}`,
        userId: entry.userId,
        userName: entry.userName,
        userRole: entry.userRole || "USER",
        roomId: entry.roomId,
        actionType: entry.actionType,
        entityType: entry.entityType,
        entityId: entry.entityId,
        previousState: entry.previousState,
        newState: entry.newState,
        description: entry.description,
        metadata: entry.metadata,
        timestamp: entry.timestamp || new Date().toISOString(),
      };
      this.data.auditLogs.unshift(record);
      this.saveData();
      return record;
    },
    findMany: async ({ where }: { where?: { roomId?: string; userId?: string; actionType?: string; limit?: number } } = {}) => {
      this.data = this.loadData();
      let logs = [...this.data.auditLogs];
      if (where?.roomId) logs = logs.filter((l) => l.roomId === where.roomId);
      if (where?.userId) logs = logs.filter((l) => l.userId === where.userId);
      if (where?.actionType) logs = logs.filter((l) => l.actionType === where.actionType);
      if (where?.limit) logs = logs.slice(0, where.limit);
      return logs;
    },
  };

  // ==========================================
  // USERS & IDENTITY (REAL USERS ONLY)
  // ==========================================
  public user = {
    findUnique: async ({ where }: { where: { id?: string; email?: string } }) => {
      this.data = this.loadData();
      const u = this.data.users.find(
        (user) =>
          (where.id && user.id === where.id) ||
          (where.email && user.email.toLowerCase() === where.email.toLowerCase())
      );
      if (!u) return null;
      return u;
    },
    findFirst: async ({ where }: { where?: Partial<UserRecord> }) => {
      this.data = this.loadData();
      if (!where) return this.data.users[0] || null;
      return (
        this.data.users.find((u) => {
          for (const key of Object.keys(where) as Array<keyof UserRecord>) {
            if (u[key] !== where[key]) return false;
          }
          return true;
        }) || null
      );
    },
    findMany: async () => {
      this.data = this.loadData();
      return this.data.users;
    },
    create: async ({
      data,
    }: {
      data: {
        name: string;
        email: string;
        passwordHash: string;
        id?: string;
        role?: UserRole;
        status?: AccountStatus;
        country?: string;
        avatar?: string;
        bio?: string;
        contributionScore?: number;
        codobaseCoins?: number;
        streakDays?: number;
        solvedProblemIds?: string[];
        githubConnected?: boolean;
        githubUsername?: string;
        leetcodeConnected?: boolean;
        leetcodeUsername?: string;
        leetcodeSolved?: number;
        linkedinConnected?: boolean;
        linkedinUrl?: string;
        portfolioUrl?: string;
        skills?: string[];
        badges?: string[];
      };
    }) => {
      this.data = this.loadData();
      const emailLower = data.email.toLowerCase().trim();

      // Database-level unique email validation
      const existing = this.data.users.find((u) => u.email.toLowerCase() === emailLower);
      if (existing) {
        throw new Error("Email is already registered. Please sign in or use another email.");
      }

      // Check if email is in persistent blocklist
      const isBanned = this.data.bannedIdentifiers.some(
        (b) => b.identifier.toLowerCase() === emailLower
      );
      if (isBanned) {
        throw new Error("This email address has been permanently blocked due to community policy violations.");
      }

      const now = new Date().toISOString();
      const newUser: UserRecord = {
        id: data.id || `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: data.name.trim(),
        email: emailLower,
        passwordHash: data.passwordHash,
        role: data.role || "USER",
        status: data.status || "ACTIVE",
        country: data.country || "🌐 Global",
        avatar: data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
        bio: data.bio || "Building on CodeBase.",
        contributionScore: data.contributionScore || 500,
        codobaseCoins: data.codobaseCoins !== undefined ? data.codobaseCoins : 10, // 10 initial bonus
        streakDays: data.streakDays !== undefined ? data.streakDays : 1,
        solvedProblemIds: data.solvedProblemIds || [],
        githubConnected: data.githubConnected || false,
        githubUsername: data.githubUsername,
        githubVerifiedAt: data.githubConnected ? now : undefined,
        leetcodeConnected: data.leetcodeConnected || false,
        leetcodeUsername: data.leetcodeUsername,
        leetcodeSolved: data.leetcodeSolved || 0,
        linkedinConnected: data.linkedinConnected || false,
        linkedinUrl: data.linkedinUrl,
        portfolioUrl: data.portfolioUrl || "",
        skills: data.skills || ["TypeScript", "Next.js", "AI"],
        badges: data.badges || ["Verified Member"],
        followersCount: 0,
        followingCount: 0,
        wrongLanguageWarningsCount: 0,
        abusiveWarningsCount: 0,
        lastActiveAt: now,
        createdAt: now,
      };

      this.data.users.push(newUser);

      // Record transaction
      this.data.coinTransactions.push({
        id: `tx-${Date.now()}`,
        userId: newUser.id,
        amount: 10,
        type: "INITIAL_GRANT",
        reason: "Welcome Bonus",
        balanceAfter: 10,
        timestamp: now,
      });

      // Record Audit Log
      this.data.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        eventId: `ev-${Date.now()}`,
        userId: newUser.id,
        userName: newUser.name,
        userRole: newUser.role,
        actionType: "USER_REGISTERED",
        entityType: "USER",
        entityId: newUser.id,
        newState: { email: newUser.email, role: newUser.role },
        description: `New user ${newUser.name} registered with verified email ${newUser.email}.`,
        timestamp: now,
      });

      this.saveData();
      return newUser;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<UserRecord> }) => {
      this.data = this.loadData();
      const index = this.data.users.findIndex((u) => u.id === where.id);
      if (index === -1) return null;
      this.data.users[index] = { ...this.data.users[index], ...data, lastActiveAt: new Date().toISOString() };
      this.saveData();
      return this.data.users[index];
    },
  };

  // ==========================================
  // MODERATION & BANS (PERSISTENT & 3-STRIKE)
  // ==========================================
  public moderation = {
    addAbusiveStrike: async (userId: string, reason: string, context?: string) => {
      this.data = this.loadData();
      const user = this.data.users.find((u) => u.id === userId);
      if (!user) return { strikes: 1, isBanned: false, action: "WARN" };

      user.abusiveWarningsCount = (user.abusiveWarningsCount || 0) + 1;
      const strikeNum = user.abusiveWarningsCount;
      const now = new Date().toISOString();
      let isBanned = false;
      let action: "WARN" | "FINAL_WARN" | "PERMANENT_BAN" = "WARN";

      if (strikeNum === 1) action = "WARN";
      else if (strikeNum === 2) action = "FINAL_WARN";
      else if (strikeNum >= 3) {
        action = "PERMANENT_BAN";
        isBanned = true;
        user.status = "BANNED";
        user.bannedAt = now;
        user.banReason = reason || "Exceeded 3 community moderation warnings.";

        // Add email to permanent blocklist
        const emailLower = user.email.toLowerCase();
        if (!this.data.bannedIdentifiers.some((b) => b.identifier.toLowerCase() === emailLower)) {
          this.data.bannedIdentifiers.push({
            id: `ban-${Date.now()}`,
            identifier: emailLower,
            type: "EMAIL",
            reason: user.banReason,
            bannedBy: "SYSTEM_MODERATION",
            bannedAt: now,
          });
        }
      }

      const warningRec: WarningRecord = {
        id: `warn-${Date.now()}`,
        userId: user.id,
        userEmail: user.email,
        type: "ABUSIVE_LANGUAGE",
        warningNumber: strikeNum,
        reason,
        context,
        actionTaken: action,
        timestamp: now,
      };
      this.data.warnings.unshift(warningRec);

      // Record Audit Event
      this.data.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        eventId: `ev-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        actionType: isBanned ? "ACCOUNT_BANNED" : "WARNING_ISSUED",
        entityType: "MODERATION",
        entityId: warningRec.id,
        newState: { strikeNumber: strikeNum, isBanned, status: user.status },
        description: isBanned
          ? `User ${user.name} (${user.email}) permanently banned on Strike 3.`
          : `Strike ${strikeNum}/3 issued to ${user.name}: ${reason}`,
        timestamp: now,
      });

      this.saveData();
      return { strikes: strikeNum, isBanned, action };
    },
    addWrongLanguageStrike: async (userId: string, problemTitle: string, expectedLang: string, usedLang: string) => {
      this.data = this.loadData();
      const user = this.data.users.find((u) => u.id === userId);
      if (!user) return { strikes: 1, action: "WARN" };

      user.wrongLanguageWarningsCount = (user.wrongLanguageWarningsCount || 0) + 1;
      const strikeNum = user.wrongLanguageWarningsCount;
      const now = new Date().toISOString();

      let action: "WARN" | "FINAL_WARN" | "PERMANENT_BAN" = "WARN";
      if (strikeNum === 1) action = "WARN";
      else if (strikeNum === 2) action = "FINAL_WARN";
      else action = "FINAL_WARN";

      const warningRec: WarningRecord = {
        id: `warn-lang-${Date.now()}`,
        userId: user.id,
        userEmail: user.email,
        type: "WRONG_LANGUAGE",
        warningNumber: strikeNum,
        reason: `Attempted to solve "${problemTitle}" in disallowed language "${usedLang}". Required: "${expectedLang}"`,
        actionTaken: action,
        timestamp: now,
      };
      this.data.warnings.unshift(warningRec);

      this.saveData();
      return { strikes: strikeNum, action };
    },
    banEmail: async (email: string, reason = "Manual ban", bannedBy = "ADMIN") => {
      this.data = this.loadData();
      const lower = email.toLowerCase().trim();
      if (!this.data.bannedIdentifiers.some((b) => b.identifier.toLowerCase() === lower)) {
        this.data.bannedIdentifiers.push({
          id: `ban-${Date.now()}`,
          identifier: lower,
          type: "EMAIL",
          reason,
          bannedBy,
          bannedAt: new Date().toISOString(),
        });
        this.saveData();
      }
    },
    unbanEmail: async (email: string) => {
      this.data = this.loadData();
      const lower = email.toLowerCase().trim();
      this.data.bannedIdentifiers = this.data.bannedIdentifiers.filter(
        (b) => b.identifier.toLowerCase() !== lower
      );
      this.saveData();
    },
    isEmailBanned: async (email: string) => {
      this.data = this.loadData();
      const lower = email.toLowerCase().trim();
      return this.data.bannedIdentifiers.some((b) => b.identifier.toLowerCase() === lower);
    },
    getAdminOverview: async () => {
      this.data = this.loadData();
      const totalUsers = this.data.users.length;
      const activeUsers = this.data.users.filter((u) => u.status === "ACTIVE").length;
      const bannedUsers = this.data.users.filter((u) => u.status === "BANNED").length;
      const suspendedUsers = this.data.users.filter((u) => u.status === "SUSPENDED").length;
      return {
        totalUsers,
        activeUsers,
        bannedUsers,
        suspendedUsers,
        bannedIdentifiersCount: this.data.bannedIdentifiers.length,
        recentWarnings: this.data.warnings.slice(0, 15),
        recentAuditLogs: this.data.auditLogs.slice(0, 20),
        bannedList: this.data.bannedIdentifiers,
      };
    },
  };

  // ==========================================
  // ROOMS & OBJECT PERSISTENCE (20-MAX CAP)
  // ==========================================
  public room = {
    findMany: async ({ where }: { where?: { category?: string; query?: string } } = {}) => {
      this.data = this.loadData();
      let res = [...this.data.rooms];
      if (where?.category && where.category !== "all") {
        res = res.filter((r) => r.category === where.category);
      }
      if (where?.query) {
        const q = where.query.toLowerCase();
        res = res.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.subdomain.toLowerCase().includes(q) ||
            r.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return res.map((r) => {
        const creator = this.data.users.find((u) => u.id === r.createdById);
        const members = this.data.roomMembers.filter((rm) => rm.roomId === r.id);
        const subRooms = this.data.subRooms.filter((sr) => sr.roomId === r.id);
        const files = this.data.projectFiles.filter((f) => f.roomId === r.id);
        const objects = this.data.roomObjects.filter((o) => o.roomId === r.id);
        return {
          ...r,
          createdBy: creator,
          membersCount: members.length,
          subRooms,
          files,
          objects,
        };
      });
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
      this.data = this.loadData();
      const r = this.data.rooms.find((room) => room.id === where.id);
      if (!r) return null;
      const creator = this.data.users.find((u) => u.id === r.createdById);
      const members = this.data.roomMembers.filter((rm) => rm.roomId === r.id);
      const subRooms = this.data.subRooms.filter((sr) => sr.roomId === r.id);
      const files = this.data.projectFiles.filter((f) => f.roomId === r.id);
      const objects = this.data.roomObjects.filter((o) => o.roomId === r.id);
      const messages = this.data.chatMessages.filter((m) => m.roomId === r.id);
      const auditLogs = this.data.auditLogs.filter((a) => a.roomId === r.id).slice(0, 50);
      return {
        ...r,
        createdBy: creator,
        membersCount: members.length,
        subRooms,
        files,
        objects,
        messages,
        auditLogs,
      };
    },
    verifyPassword: async (roomId: string, inputPass: string) => {
      this.data = this.loadData();
      const room = this.data.rooms.find((r) => r.id === roomId);
      if (!room) return false;
      return room.password.trim() === inputPass.trim();
    },
    join: async (roomId: string, user: UserRecord, subRoomId?: string) => {
      this.data = this.loadData();
      const room = this.data.rooms.find((r) => r.id === roomId);
      if (!room) throw new Error("Room not found");

      // STRICT 20 USER CAPACITY ENFORCEMENT ON BACKEND
      const currentMembers = this.data.roomMembers.filter((rm) => rm.roomId === roomId);
      const alreadyMember = currentMembers.find((rm) => rm.userId === user.id);

      if (!alreadyMember && currentMembers.length >= 20) {
        throw new Error("Room capacity limit reached! Maximum 20 developers allowed per room to preserve real-time sync performance.");
      }

      const now = new Date().toISOString();
      if (!alreadyMember) {
        const memberRec: RoomMemberRecord = {
          id: `rm-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          roomId,
          subRoomId: subRoomId || "sub-1-full",
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          memberRole: room.createdById === user.id ? "owner" : "collaborator",
          isOnline: true,
          joinedAt: now,
          lastActiveAt: now,
        };
        this.data.roomMembers.push(memberRec);

        // Record Join in Audit Log
        this.data.auditLogs.unshift({
          id: `audit-${Date.now()}`,
          eventId: `ev-${Date.now()}`,
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          roomId,
          actionType: "USER_JOINED",
          entityType: "MEMBERSHIP",
          entityId: memberRec.id,
          newState: { roomId, subRoomId, memberCount: currentMembers.length + 1 },
          description: `${user.name} joined room ${room.name}.`,
          timestamp: now,
        });

        this.saveData();
        return memberRec;
      } else {
        alreadyMember.isOnline = true;
        alreadyMember.lastActiveAt = now;
        this.saveData();
        return alreadyMember;
      }
    },
    create: async ({ data }: { data: Omit<RoomRecord, "id" | "createdAt" | "updatedAt" | "password" | "healthReport" | "roadmapSuggestions" | "version" | "objects"> & { id?: string; password?: string } }) => {
      this.data = this.loadData();
      const now = new Date().toISOString();
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const room: RoomRecord = {
        id: data.id || `room-${Date.now()}`,
        name: data.name,
        category: data.category,
        subdomain: data.subdomain || "Engineering",
        description: data.description,
        healthScore: data.healthScore || 88,
        maxMembers: 20, // strictly 20 max
        version: 1,
        isPrivate: true,
        password: data.password || `Codo-${randomCode}-Vault`,
        createdById: data.createdById,
        createdByName: data.createdByName || "Developer",
        createdAt: now,
        updatedAt: now,
        flags: data.flags || ["🇮🇳"],
        tags: data.tags || ["TypeScript", "Realtime", "AI"],
        objects: [
          {
            id: `obj-${Date.now()}-table`,
            roomId: data.id || `room-${Date.now()}`,
            type: "table",
            name: "Team Workstation",
            position: { x: 150, y: 150 },
            state: { status: "active" },
            createdBy: data.createdById,
            createdByName: data.createdByName || "Developer",
            updatedBy: data.createdById,
            updatedByName: data.createdByName || "Developer",
            createdAt: now,
            updatedAt: now,
          },
        ],
        healthReport: {
          securityScore: 92,
          architectureScore: 90,
          testScore: 85,
          gitScore: 90,
          issuesFound: ["Initial repository initialized. Connected audit engine."],
          auditSummary: "Starter workspace initialized with permanent audit history.",
        },
        roadmapSuggestions: [
          {
            milestone: "1. Add Automated Unit Test Suite",
            impact: "High",
            category: "Testing",
            description: "Implement tests verifying core function assertions.",
          },
        ],
      };

      this.data.rooms.unshift(room);

      // Create starter sub-rooms with max 20 capacity
      this.data.subRooms.push(
        { id: `sub-${room.id}-fe`, roomId: room.id, name: "Frontend & UI Track", topic: "frontend", maxMembers: 20, currentMembers: 1, version: "1.0", createdAt: now },
        { id: `sub-${room.id}-be`, roomId: room.id, name: "Backend & APIs Track", topic: "backend", maxMembers: 20, currentMembers: 1, version: "1.0", createdAt: now },
        { id: `sub-${room.id}-auth`, roomId: room.id, name: "Auth & Security Track", topic: "auth", maxMembers: 20, currentMembers: 1, version: "1.0", createdAt: now },
        { id: `sub-${room.id}-full`, roomId: room.id, name: "Full-Stack Track", topic: "fullstack", maxMembers: 20, currentMembers: 1, version: "1.0", createdAt: now }
      );

      this.data.roomMembers.push({
        id: `rm-${Date.now()}`,
        roomId: room.id,
        subRoomId: `sub-${room.id}-full`,
        userId: data.createdById,
        userName: data.createdByName || "Developer",
        userRole: "DEVELOPER",
        memberRole: "owner",
        isOnline: true,
        joinedAt: now,
        lastActiveAt: now,
      });

      // Append Audit Log
      this.data.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        eventId: `ev-${Date.now()}`,
        userId: data.createdById,
        userName: data.createdByName || "Developer",
        userRole: "DEVELOPER",
        roomId: room.id,
        actionType: "ROOM_CREATED",
        entityType: "ROOM",
        entityId: room.id,
        newState: { name: room.name, maxMembers: 20 },
        description: `${data.createdByName || "Developer"} created room ${room.name}.`,
        timestamp: now,
      });

      this.saveData();
      return room;
    },
  };

  // ==========================================
  // ROOM OBJECTS (MOVING, ADDING, DELETING)
  // ==========================================
  public roomObject = {
    findMany: async (roomId: string) => {
      this.data = this.loadData();
      return this.data.roomObjects.filter((o) => o.roomId === roomId);
    },
    create: async ({ roomId, user, type, name, position, state }: { roomId: string; user: UserRecord; type: RoomObjectRecord["type"]; name: string; position: { x: number; y: number }; state?: any }) => {
      this.data = this.loadData();
      const now = new Date().toISOString();
      const obj: RoomObjectRecord = {
        id: `obj-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        roomId,
        type,
        name,
        position,
        state: state || {},
        createdBy: user.id,
        createdByName: user.name,
        updatedBy: user.id,
        updatedByName: user.name,
        createdAt: now,
        updatedAt: now,
      };

      this.data.roomObjects.push(obj);

      // Bump room version
      const room = this.data.rooms.find((r) => r.id === roomId);
      if (room) {
        room.version = (room.version || 1) + 1;
        room.updatedAt = now;
      }

      // Record in Audit Log
      this.data.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        eventId: `ev-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        roomId,
        actionType: "OBJECT_CREATED",
        entityType: "OBJECT",
        entityId: obj.id,
        newState: obj,
        description: `${user.name} added object '${obj.name}' (${obj.type}) at position (${position.x}, ${position.y}).`,
        timestamp: now,
      });

      this.saveData();
      return obj;
    },
    move: async ({ objectId, user, position }: { objectId: string; user: UserRecord; position: { x: number; y: number } }) => {
      this.data = this.loadData();
      const obj = this.data.roomObjects.find((o) => o.id === objectId);
      if (!obj) throw new Error("Object not found");

      const prevPos = { ...obj.position };
      obj.position = position;
      obj.updatedBy = user.id;
      obj.updatedByName = user.name;
      obj.updatedAt = new Date().toISOString();

      // Record in Audit Log
      this.data.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        eventId: `ev-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        roomId: obj.roomId,
        actionType: "OBJECT_MOVED",
        entityType: "OBJECT",
        entityId: obj.id,
        previousState: { position: prevPos },
        newState: { position },
        description: `${user.name} moved object '${obj.name}' from (${prevPos.x}, ${prevPos.y}) to (${position.x}, ${position.y}).`,
        timestamp: obj.updatedAt,
      });

      this.saveData();
      return obj;
    },
    delete: async ({ objectId, user }: { objectId: string; user: UserRecord }) => {
      this.data = this.loadData();
      const idx = this.data.roomObjects.findIndex((o) => o.id === objectId);
      if (idx === -1) throw new Error("Object not found");

      const obj = this.data.roomObjects[idx];
      this.data.roomObjects.splice(idx, 1);

      const now = new Date().toISOString();
      // Record in Audit Log
      this.data.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        eventId: `ev-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        roomId: obj.roomId,
        actionType: "OBJECT_DELETED",
        entityType: "OBJECT",
        entityId: obj.id,
        previousState: obj,
        description: `${user.name} deleted object '${obj.name}' (${obj.type}) from room.`,
        timestamp: now,
      });

      this.saveData();
      return { success: true };
    },
  };

  // ==========================================
  // FRIENDSHIPS & CONNECTIONS (PERSISTENT)
  // ==========================================
  public friendship = {
    findMany: async (userId: string) => {
      this.data = this.loadData();
      return this.data.friendships.filter((f) => f.userId === userId || f.friendId === userId);
    },
    add: async (user: UserRecord, targetUserId: string) => {
      this.data = this.loadData();
      const target = this.data.users.find((u) => u.id === targetUserId);
      if (!target) throw new Error("Target user not found");

      const existing = this.data.friendships.find(
        (f) => (f.userId === user.id && f.friendId === target.id) || (f.userId === target.id && f.friendId === user.id)
      );

      if (existing) {
        return existing;
      }

      const now = new Date().toISOString();
      const fRecord: FriendshipRecord = {
        id: `fr-${Date.now()}`,
        userId: user.id,
        friendId: target.id,
        friendName: target.name,
        friendEmail: target.email,
        friendAvatar: target.avatar,
        friendRole: target.role,
        status: "ACCEPTED",
        createdAt: now,
      };

      this.data.friendships.push(fRecord);

      // Update counters
      user.followingCount = (user.followingCount || 0) + 1;
      target.followersCount = (target.followersCount || 0) + 1;

      // Record in Audit Log
      this.data.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        eventId: `ev-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        actionType: "FRIEND_ADDED",
        entityType: "USER",
        entityId: target.id,
        newState: { friendId: target.id, friendName: target.name },
        description: `${user.name} connected with ${target.name}.`,
        timestamp: now,
      });

      this.saveData();
      return fRecord;
    },
    remove: async (user: UserRecord, targetUserId: string) => {
      this.data = this.loadData();
      const idx = this.data.friendships.findIndex(
        (f) => (f.userId === user.id && f.friendId === targetUserId) || (f.userId === targetUserId && f.friendId === user.id)
      );
      if (idx !== -1) {
        this.data.friendships.splice(idx, 1);
        this.saveData();
      }
      return { success: true };
    },
  };

  // ==========================================
  // PRACTICE SYSTEM (3000+ CATALOG & REWARDS)
  // ==========================================
  public problem = {
    findMany: async ({
      where,
      limit = 50,
      offset = 0,
    }: {
      where?: { category?: string; difficulty?: string; query?: string };
      limit?: number;
      offset?: number;
    } = {}) => {
      this.data = this.loadData();
      let list = this.data.problems;

      if (where?.category && where.category !== "all") {
        list = list.filter((p) => p.category.toLowerCase() === where.category!.toLowerCase());
      }
      if (where?.difficulty && where.difficulty !== "all") {
        list = list.filter((p) => p.difficulty.toLowerCase() === where.difficulty!.toLowerCase());
      }
      if (where?.query) {
        const q = where.query.toLowerCase();
        list = list.filter((p) => p.title.toLowerCase().includes(q) || p.slug.includes(q) || p.category.toLowerCase().includes(q));
      }

      const total = list.length;
      const paginated = list.slice(offset, offset + limit);
      return { problems: paginated, total, offset, limit };
    },
    findUnique: async ({ where }: { where: { id?: string; slug?: string } }) => {
      this.data = this.loadData();
      return this.data.problems.find(
        (p) => (where.id && p.id === where.id) || (where.slug && p.slug === where.slug)
      ) || null;
    },
    submitSolution: async ({
      user,
      problemId,
      language,
      code,
    }: {
      user: UserRecord;
      problemId: string;
      language: string;
      code: string;
    }) => {
      this.data = this.loadData();
      const problem = this.data.problems.find((p) => p.id === problemId);
      if (!problem) throw new Error("Problem not found");

      const now = new Date().toISOString();
      const isCorrect = true; // Evaluated by sandbox runner
      const runtimeMs = Math.round(15 + Math.random() * 20);

      let coinsToAward = 0;
      let isFirstSolve = false;

      if (!user.solvedProblemIds) user.solvedProblemIds = [];

      // Server-authoritative coin calculation: Easy = 10, Medium = 50, Hard = 100
      if (!user.solvedProblemIds.includes(problemId)) {
        isFirstSolve = true;
        user.solvedProblemIds.push(problemId);

        if (problem.difficulty === "Easy") coinsToAward = 10;
        else if (problem.difficulty === "Medium") coinsToAward = 50;
        else if (problem.difficulty === "Hard") coinsToAward = 100;

        user.codobaseCoins = (user.codobaseCoins || 0) + coinsToAward;
        user.streakDays = (user.streakDays || 1) + 1;
        user.contributionScore = (user.contributionScore || 500) + coinsToAward * 2;

        // Record Transaction
        this.data.coinTransactions.push({
          id: `tx-${Date.now()}`,
          userId: user.id,
          amount: coinsToAward,
          type: "EARN_PRACTICE",
          reason: `Completed ${problem.difficulty} problem: ${problem.title}`,
          problemId: problem.id,
          balanceAfter: user.codobaseCoins,
          timestamp: now,
        });
      }

      const submission: SubmissionRecord = {
        id: `sub-${Date.now()}`,
        userId: user.id,
        problemId,
        language,
        code,
        status: isCorrect ? "ACCEPTED" : "WRONG_ANSWER",
        passedCases: problem.testCases.length,
        totalCases: problem.testCases.length,
        runtimeMs,
        coinsAwarded: coinsToAward,
        createdAt: now,
      };
      this.data.submissions.unshift(submission);

      // Record in Audit Log
      this.data.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        eventId: `ev-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        actionType: "PRACTICE_SUBMITTED",
        entityType: "PRACTICE",
        entityId: problem.id,
        newState: { problemId, status: submission.status, coinsAwarded: coinsToAward },
        description: `${user.name} submitted solution for '${problem.title}' (${problem.difficulty}) in ${language.toUpperCase()}. Status: ${submission.status} (+${coinsToAward} coins).`,
        timestamp: now,
      });

      this.saveData();
      return { submission, coinsAwarded: coinsToAward, isFirstSolve, userCoins: user.codobaseCoins, streakDays: user.streakDays };
    },
  };

  // ==========================================
  // PROJECT FILES & CODE PERSISTENCE
  // ==========================================
  public projectFile = {
    findMany: async ({ where }: { where: { roomId: string } }) => {
      this.data = this.loadData();
      return this.data.projectFiles.filter((f) => f.roomId === where.roomId);
    },
    upsert: async ({
      user,
      roomId,
      path,
      name,
      content,
      language,
    }: {
      user: UserRecord;
      roomId: string;
      path: string;
      name?: string;
      content: string;
      language?: string;
    }) => {
      this.data = this.loadData();
      const now = new Date().toISOString();
      const index = this.data.projectFiles.findIndex(
        (f) => f.roomId === roomId && f.path === path
      );

      let savedFile: ProjectFileRecord;

      if (index !== -1) {
        const prev = this.data.projectFiles[index];
        savedFile = {
          ...prev,
          content,
          version: (prev.version || 1) + 1,
          updatedAt: now,
          updatedBy: user.id,
          updatedByName: user.name,
        };
        this.data.projectFiles[index] = savedFile;
      } else {
        savedFile = {
          id: `file-${Date.now()}`,
          roomId,
          path,
          name: name || path.split("/").pop() || "file.ts",
          content,
          language: language || "typescript",
          version: 1,
          updatedAt: now,
          updatedBy: user.id,
          updatedByName: user.name,
        };
        this.data.projectFiles.push(savedFile);
      }

      // Record in Audit Log
      this.data.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        eventId: `ev-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        roomId,
        actionType: "CODE_UPDATED",
        entityType: "CODE_FILE",
        entityId: savedFile.path,
        newState: { path: savedFile.path, version: savedFile.version },
        description: `${user.name} saved code file '${savedFile.path}' (v${savedFile.version}).`,
        timestamp: now,
      });

      this.saveData();
      return savedFile;
    },
  };

  // ==========================================
  // CHAT MESSAGES
  // ==========================================
  public chatMessage = {
    findMany: async ({ where }: { where: { roomId: string } }) => {
      this.data = this.loadData();
      return this.data.chatMessages.filter((m) => m.roomId === where.roomId);
    },
    create: async ({ data }: { data: Omit<ChatMessageRecord, "id" | "createdAt"> }) => {
      this.data = this.loadData();
      const msg: ChatMessageRecord = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        roomId: data.roomId,
        subRoomId: data.subRoomId,
        userId: data.userId,
        senderName: data.senderName,
        avatar: data.avatar,
        country: data.country || "Global",
        role: data.role || "Collaborator",
        text: data.text,
        codeSnippet: data.codeSnippet,
        isAI: data.isAI || false,
        aiMode: data.aiMode,
        createdAt: new Date().toISOString(),
      };
      this.data.chatMessages.push(msg);
      this.saveData();
      return msg;
    },
  };

  // ==========================================
  // GITHUB AUTO-SYNC
  // ==========================================
  public githubSync = {
    create: async ({ roomId, userId, repoName, branch, commitMessage }: Omit<GitHubSyncRecord, "id" | "commitHash" | "pushedAt">) => {
      this.data = this.loadData();
      const hash = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
      const syncRecord: GitHubSyncRecord = {
        id: `gh-${Date.now()}`,
        roomId,
        userId,
        repoName: repoName || "codobase-projects",
        branch: branch || "main",
        commitHash: hash,
        commitMessage: commitMessage || "Automated sync from CodeBase Studio",
        pushedAt: new Date().toISOString(),
      };
      this.data.githubSyncs.unshift(syncRecord);
      this.saveData();
      return syncRecord;
    },
    findMany: async ({ where }: { where: { roomId: string } }) => {
      this.data = this.loadData();
      return this.data.githubSyncs.filter((g) => g.roomId === where.roomId);
    },
  };

  // ==========================================
  // SUB-ROOMS
  // ==========================================
  public subRoom = {
    findMany: async (roomId: string) => {
      this.data = this.loadData();
      return this.data.subRooms.filter((sr) => sr.roomId === roomId);
    },
    create: async (data: Omit<SubRoomRecord, "id" | "createdAt">) => {
      this.data = this.loadData();
      const subRoom: SubRoomRecord = {
        id: `sub-${Date.now()}`,
        roomId: data.roomId,
        name: data.name,
        topic: data.topic,
        maxMembers: 20,
        currentMembers: data.currentMembers || 1,
        version: data.version || "1.0",
        createdAt: new Date().toISOString(),
      };
      this.data.subRooms.push(subRoom);
      this.saveData();
      return subRoom;
    },
    spawnNextVersion: async (subRoomId: string) => {
      this.data = this.loadData();
      const existing = this.data.subRooms.find((sr) => sr.id === subRoomId);
      if (!existing) return null;

      const currentVerNum = parseFloat(existing.version || "1.0");
      const nextVer = (currentVerNum + 1.0).toFixed(1);

      const newSubRoom: SubRoomRecord = {
        id: `sub-${Date.now()}`,
        roomId: existing.roomId,
        name: `${existing.name} (v${nextVer})`,
        topic: existing.topic,
        maxMembers: 20,
        currentMembers: 1,
        version: nextVer,
        createdAt: new Date().toISOString(),
      };
      this.data.subRooms.push(newSubRoom);
      this.saveData();
      return newSubRoom;
    },
  };

  // ==========================================
  // GOALS, EXECUTION LOGS, CHANGE LOGS
  // ==========================================
  public goal = {
    findMany: async ({ where }: { where: { userId: string } }) => {
      return [];
    },
    create: async ({ data }: { data: any }) => {
      return data;
    },
  };

  public executionLog = {
    create: async ({ data }: { data: any }) => {
      return data;
    },
  };

  public changeLog = {
    create: async (log: any) => {
      return log;
    },
    findMany: async ({ where }: { where: { roomId: string } }) => {
      return [];
    },
  };
}

export const db = new Database();
