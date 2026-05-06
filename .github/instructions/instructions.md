---
applyTo: "**"
---

# コードレビュー指示

すべてのレビューコメントは**日本語**で記述してください。

---

## 共通ルール（全ファイル共通）

- TypeScript の型安全性を確認する。`any` 型の不用意な使用は指摘する
- Biome によるフォーマット・Lint ルールに準拠しているか確認する（`pnpm check` で自動修正可能）
- 不要なコメント・デッドコード・未使用のインポートを指摘する
- セキュリティリスク（XSS、インジェクション等）がないか確認する
- 変更スコープを超えたリファクタリングや追加実装が含まれていないか確認する

---

## ラベル別レビュー観点

### `doc` — `docs/**`

- README.md と `docs/README-ja.md` は常に同期されているか（内容・構成が一致しているか）
- 技術的な記述に誤りや古い情報が含まれていないか
- コードサンプルは実際の実装と一致しているか

---

### `popup` — `src/entrypoints/popup/**`, `src/entrypoints/sidepanel/**`

- UI コンポーネントが `runtimeService` 以外のサービスを直接呼び出していないか
  - `storageService` や `contentService` の直接呼び出しはアーキテクチャ違反（偏差として管理中）
  - 新たな直接呼び出しを追加していないか確認する
- `chrome.action.openPopup()` を呼び出す場合、`await` より前（同期的）に呼び出されているか
  - 非同期コールバック内での呼び出しはユーザージェスチャートークンが失われるため NG

---

### `components` — `src/features/*/components/**`, `src/shared/components/**`

- コンポーネントは props を受け取って描画するだけで、ビジネスロジック・サービス呼び出し・副作用を持っていないか
- Props 型は同一ファイル内に定義されているか
- リスト系アイテムコンポーネント（`TabItem`, `BookmarkItem` 等）は `ButtonItem` の `LeftContent`/`RightContent` スロットを使って構成されているか
- `item.data` は実際に使用するフィールドのみ `Pick` で絞り込まれているか
- コンポーネントファイルは `src/features/[feature]/components/[ComponentName]/` 配下に配置されているか
- 新しいコンポーネントはスクリプト（`cd scripts && go run main.go gen component`）で生成されているか（手動作成になっていないか）
- Storybook ファイル（`.stories.tsx`）が作成されているか

---

### `hooks` — `src/features/*/hooks/**`, `src/shared/hooks/**`

- Hook は純粋に props 準備（状態・副作用・サービス呼び出し）に専念しており、JSX を返していないか
- 戻り値はフラットなオブジェクト形式になっているか（タプルやネストしたオブジェクトは避ける）
- 複雑な Hook はフォルダ構成（`index.ts`, `hook.ts`, `types.ts`, `constants.ts`, `helper.ts`, `reducer.ts`）になっているか
- `useSyncExternalStore` を使う場合、`getSnapshot` は状態が変わっていない限り同一参照を返しているか
- 外部状態ライブラリ（Zustand、React Query 等）を使っていないか（React 標準 API のみ使用する）
- Hook のエクスポートは `export default function useXxx()` 形式になっているか

---

### `backend` — `src/entrypoints/background/**`

- `chrome.action.openPopup()` は必ず `await` より前（同期的）に呼び出されているか
- 新しいメッセージタイプを追加した場合、`MessageType` enum（`src/services/runtime/types.ts`）にも定義が追加されているか
- `router/message.ts` でのハンドリングが漏れていないか
- Chrome API の呼び出しエラーは適切にハンドリングされているか

---

### `service` — `src/services/**`

- 新規サービスはスクリプト（`cd scripts && go run main.go gen service --name <ServiceName>`）で生成されているか（手動作成になっていないか）
- 各サービスが単一責任を持っているか（役割の越境がないか）
  - `result`: 集約・ファジー検索のみ。Chrome API 直接呼び出しは NG
  - `tab`, `bookmark`, `history`, `suggestion`, `action`: それぞれ単一ドメインのみ担当
- 新しい永続化キーを追加した場合、`SyncStorageKey` enum と `SyncStorage` インターフェース（`src/services/storage/types.ts`）が更新されているか
- UI コード（popup / sidepanel / features）から `runtime` 以外のサービスを新たに呼び出していないか

---

### `utilities` — `src/utils/**`, `src/lib/**`

- 純粋関数として実装されているか（副作用・外部依存がないか）
- 単一ユースケースのためだけの汎用ユーティリティを追加していないか（過度な抽象化を避ける）
- `src/lib/` に置くべきか `src/utils/` に置くべきか（外部ライブラリのラッパーは `lib/`、純粋なユーティリティは `utils/`）

---

### `i18n` — `src/locales/**`

- 追加・変更したキーが `en.json` と `ja.json` の両方に存在するか
- 既存のキーと命名スタイルが一致しているか

---

### `scripts` — `scripts/**`

- Go スクリプトのコード生成テンプレートが現在のアーキテクチャ規約と一致しているか
- 生成されたコードがプロジェクトの命名規則・ファイル構成に準拠しているか

---

### `ci` — `.github/workflows/**`, `.gemini/**`

- CI で実行されるコマンドが `pnpm check`（Biome）・`pnpm compile`（型チェック）を含んでいるか
- ブランチフィルタ・パスフィルタが意図した範囲を対象にしているか
- シークレットや認証情報がワークフロー内にハードコードされていないか
- `labeler.yml` のラベル定義がディレクトリ構成の実態と一致しているか

---

## アーキテクチャ違反チェックリスト

以下は必ず確認すること：

| チェック項目 | 説明 |
|---|---|
| UI からのサービス直接呼び出し | UI は `runtimeService` のみ参照。`storageService` / `contentService` の新規追加は NG |
| 非同期内での `openPopup` 呼び出し | ユーザージェスチャートークンが失われるため `await` より前に呼ぶ |
| 外部状態ライブラリの導入 | Zustand・React Query 等の追加は設計方針に反する |
| 手動によるコンポーネント・サービス作成 | 生成スクリプトを使用すること |
| README の片方だけ更新 | `README.md` と `docs/README-ja.md` は必ず両方更新する |
