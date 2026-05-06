---
name: arch-issue
description: "分析済みの問題からGitHub Issueを作成し、ラベルを付与する。Use when: issue creation, github issue, create issues from analysis"
---

# Arch Issue

`/arch-analyze` や `/arch-plan` で整理した問題をGitHub Issueとして登録します。
問題ごとに1つのIssueを作成し、ラベルを付与します。

## 実行手順

### Step 1: 入力の確認

引数 `$ARGUMENTS` を確認してください：

- **`.analysis/` ファイルパス** → そのファイルから問題一覧を読み込む
- **引数なし** → `.analysis/` 内の最新ファイルを使用する

ファイルを読み込み、問題一覧・問題詳細・対応方針（あれば）を把握してください。

### Step 2: Issueの作成

問題ごとに1つのIssueを `gh issue create` で作成してください。

**タイトル形式**: `fix:` / `feat:` / `refactor:` + 問題の要旨（英語）

**本文の構成**:

```
## 問題
[何が問題か・なぜ問題かを具体的に。現状コードのスニペットを含める]

## 影響範囲
[影響するファイル・関数・ユーザー体験]

## 改善案
[対応方針が `.analysis/` にある場合はそれを転記する。ない場合は概要のみ記載する]

## 不足している知識（任意）
[このバグ・設計ミスの背景にある概念を説明する]

## 優先度
**重大/中/低** — [一言で理由]
```

**対応方針がある場合**: `## 改善案` に Option A / B / C と推奨案を含めてください。

### Step 3: ラベルの付与

`gh issue edit` で以下のラベルを付与してください：

- 優先度: `priority: high` / `priority: medium` / `priority: low`
- 種別: `bug` / `enhancement` / `refactor` から該当するもの
- 場所: `backend` / `service` / `hooks` / `components` から該当するもの

### Step 4: 分析ファイルへのIssueリンク追記

`.analysis/` ファイルの問題一覧テーブルに `関連Issue` 列がある場合、作成したIssue番号とURLを追記してください。

```markdown
| #   | 問題 | 深刻度 | 関連Issue  |
| --- | ---- | ------ | ---------- |
| 1   | ...  | 重大   | [#42](URL) |
```

### Step 5: 結果のサマリー

以下の形式でユーザーに報告してください：

```
## 作成したIssue

| Issue | タイトル | 深刻度 |
|---|---|---|
| [#XXX](URL) | タイトル | 重大/中/低 |
```

---

引数: $ARGUMENTS
