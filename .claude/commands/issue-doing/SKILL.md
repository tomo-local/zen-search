---
name: issue-doing
description: "GitHub Issueを取得して、優先度を確認して1件以上のIssueを完了させる。Use when: issue triage, task management, sprint planning, backlog grooming"
---

# Issue Doing

GitHub Issueを取得して、優先度を確認し、1件以上のIssueを完了させます。

## 実行手順

### Step 1: Issueの取得

```sh
gh issue list --repo <owner>/<repo> --state open --label <label> --json number,title,labels,createdAt
```

このコマンドで、指定したリポジトリのオープンなIssueを取得します。必要に応じて、`--label`オプションで特定のラベルを持つIssueに絞り込むことができます。

### Step 2: 優先度の確認

取得したIssueの中から、優先度を確認して、完了させるべきIssueを選択します。優先度は、ラベルや作成日時などを参考に判断してください。 例えば、`priority:high`というラベルが付いているIssueは優先度が高いと判断できます。

### Step 3: 対応作業

選択したIssueに対して、必要な対応作業を行います。コードの修正やドキュメントの更新など、Issueの内容に応じた作業を実施してください。

1. Issueの内容を理解し、必要な変更を特定します。
2. コードを修正し、必要に応じてテストコードも更新します。
3. `/codex-review`コマンドを使用して、コードレビューを依頼します。
4. コードレビューが完了し、問題がなければ、PRを作成します。
5. PRがマージされたら、Issueをクローズします。
6. Issueをクローズした後、必要に応じて、関連するドキュメントやタスク管理ツールも更新してください。
7. 完了したIssueの内容や対応作業をチーム内で共有し、今後の参考にしてください。
8. 定期的にIssueの状況を確認し、優先度の高いIssueが適切に対応されているかを監視してください。
