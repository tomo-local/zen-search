---
name: arch-review
description: "コードベースの分析・対応方針の検討・GitHub Issue作成をまとめて実行する。Use when: full architecture review, end-to-end review, all-in-one review"
---

# Arch Review

分析 → 対応方針の検討 → Issue作成 を一連で実行するオーケストレーターです。
各ステップを個別に実行したい場合は以下の専用スキルを使ってください：

| スキル | 役割 |
|--------|------|
| `/arch-analyze` | コードを分析して問題を洗い出し、`.analysis/` に保存する |
| `/arch-plan` | 分析済みの問題に対して複数の対応方針を検討し、推奨案を選定する |
| `/arch-issue` | 分析・対応方針をもとに GitHub Issue を作成する |

## 実行手順

以下の3スキルを順番に実行してください。各スキルの詳細な手順はそれぞれのSKILL.mdに従ってください。

### Step 1: コードの分析（`/arch-analyze` 相当）

`/arch-analyze` の手順に従い、以下を実施してください：

1. 引数 `$ARGUMENTS` から対象を特定する
2. 対象コードを読み込み、設計・型安全性・Reactパターン・非同期処理・アーキテクチャ整合性・オブザーバビリティの観点で問題を洗い出す
3. 問題をトリアージ（重大/中/低）する
4. **問題が0件の場合**: 以降のステップは実行せず終了する
5. `.analysis/YYYY-MM-DD-<対象名>-review.md` に分析結果を保存する

### Step 2: 対応方針の検討（`/arch-plan` 相当）

`/arch-plan` の手順に従い、Step 1 で作成した `.analysis/` ファイルを対象に以下を実施してください：

1. 各問題に対して Option A / B (/ C) を検討する
2. トレードオフを整理し、推奨案を選定する
3. `.analysis/` ファイルの各問題詳細に「対応方針」セクションを追記する

### Step 3: GitHub Issue の作成（`/arch-issue` 相当）

`/arch-issue` の手順に従い、Step 1・2 の成果物をもとに以下を実施してください：

1. 問題ごとに `gh issue create` で Issue を作成する
2. `gh issue edit` でラベルを付与する
3. `.analysis/` ファイルの問題一覧に Issue リンクを追記する

### Step 4: 結果のサマリー

以下の形式でユーザーに報告してください：

```
## 作成したIssue

| Issue | タイトル | 深刻度 |
|---|---|---|
| [#XXX](URL) | タイトル | 重大/中/低 |

## 分析ファイル

`.analysis/YYYY-MM-DD-<対象名>-review.md` に保存しました。
```

---

引数: $ARGUMENTS
