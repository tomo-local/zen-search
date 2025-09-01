package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"util/file_operator"

	"github.com/spf13/cobra"
)

var (
	componentName string
	outputPath    string
)

// rootCmd はベースコマンドを表します
var rootCmd = &cobra.Command{
	Use:   "component-generator",
	Short: "Reactコンポーネントテンプレート生成ツール ⚛️",
	Long: `指定されたコンポーネント名でReactコンポーネントのテンプレートファイルを生成するツールです。

このツールは templates/ ディレクトリから .tmpl ファイルを読み取り、
指定された出力先に TypeScript/TSX ファイルとして生成します。`,
	Example: `  component-generator generate -n MyButton -p src/components/ui
  component-generator generate -n UserCard -p src/components/modules
  component-generator generate --name ProductList --path src/widgets`,
}

// generateCmd はコンポーネント生成コマンドを表します
var generateCmd = &cobra.Command{
	Use:   "generate",
	Short: "Reactコンポーネントファイルを生成します ⚛️✨",
	Long: `指定されたコンポーネント名でReactコンポーネントのテンプレートファイルを生成します。

テンプレートファイル（.tmpl）は TypeScript/TSX ファイルとして
指定された出力先ディレクトリに生成されます。`,
	Run: generateComponent,
}

func init() {
	// generateコマンドにフラグを追加
	generateCmd.Flags().StringVarP(&componentName, "name", "n", "", "コンポーネント名を指定してください（必須）")
	generateCmd.Flags().StringVarP(&outputPath, "path", "p", "", "出力先のパスを指定してください（必須）")

	// nameフラグとpathフラグを必須に設定
	generateCmd.MarkFlagRequired("name")
	generateCmd.MarkFlagRequired("path")

	// rootコマンドにgenerateコマンドを追加
	rootCmd.AddCommand(generateCmd)
}

func generateComponent(cmd *cobra.Command, args []string) {
	fmt.Printf("⚛️  コンポーネント名: %s でテンプレートをコピーします...\n", componentName)
	fmt.Printf("📁 出力先パス: %s\n", outputPath)

	// file_operatorのインスタンスを作成
	fileOp := file_operator.NewFileOperator()

	// テンプレートディレクトリのパス
	templatesDir := "templates"

	// 出力先ディレクトリのパス（指定されたパス配下にコンポーネント名のディレクトリを作成）
	var outputDir string
	if filepath.IsAbs(outputPath) {
		// 絶対パスの場合はそのまま使用
		outputDir = filepath.Join(outputPath, componentName)
	} else {
		// 相対パスの場合はプロジェクトルートからの相対パスとして扱う
		outputDir = filepath.Join("..", "..", outputPath, componentName)
	}

	// 出力ディレクトリが存在するかチェック
	if exists, err := fileOp.HasPath(filepath.Dir(outputDir), filepath.Base(outputDir)); err != nil {
		log.Fatalf("❌ ディレクトリの確認でエラーが発生しました: %v", err)
	} else if exists {
		fmt.Printf("⚠️  警告: ディレクトリ %s は既に存在します。\n", outputDir)
	} else {
		// 出力ディレクトリを作成
		if err := fileOp.CreateDirectory(outputDir); err != nil {
			log.Fatalf("❌ 出力ディレクトリの作成に失敗しました: %v", err)
		}
		fmt.Printf("📂 出力ディレクトリを作成しました: %s\n", outputDir)
	}

	// テンプレートファイルの一覧を取得
	templateFiles, err := fileOp.GetPathList(templatesDir)
	if err != nil {
		log.Fatalf("❌ テンプレートディレクトリの読み取りに失敗しました: %v", err)
	}

	fmt.Println("\n📝 ファイルをコピー中...")

	// 各テンプレートファイルをコピー（テンプレート変数を置換）
	for _, templateFile := range templateFiles {
		if !strings.HasSuffix(templateFile, ".tmpl") {
			continue // .tmplファイル以外はスキップ
		}

		// テンプレートファイルのパス
		srcPath := filepath.Join(templatesDir, templateFile)

		// 出力ファイル名を決定
		var outputFileName string
		if strings.HasPrefix(templateFile, "Component.") {
			// Component.tsx.tmpl -> {ComponentName}.tsx
			extension := strings.TrimSuffix(strings.TrimPrefix(templateFile, "Component."), ".tmpl")
			outputFileName = componentName + "." + extension
		} else {
			// その他のファイル（index.ts.tmpl -> index.ts）
			outputFileName = strings.TrimSuffix(templateFile, ".tmpl")
		}

		destPath := filepath.Join(outputDir, outputFileName)

		// テンプレートファイルの内容を読み取り
		content, err := fileOp.GetPathContents(srcPath)
		if err != nil {
			log.Printf("❌ テンプレートファイル %s の読み取りに失敗しました: %v", templateFile, err)
			continue
		}

		// テンプレート変数を置換
		processedContent := strings.ReplaceAll(string(content), "{{.ComponentName}}", componentName)
		processedContent = strings.ReplaceAll(processedContent, "{{.componentName}}", strings.ToLower(componentName))

		// ファイルに書き込み
		if err := fileOp.WritePathContents(destPath, []byte(processedContent)); err != nil {
			log.Printf("❌ ファイル %s の書き込みに失敗しました: %v", outputFileName, err)
			continue
		}

		fmt.Printf("  ✅ %s -> %s\n", srcPath, destPath)
	}

	fmt.Printf("\n🎉 コンポーネント '%s' のテンプレートファイルのコピーが完了しました！\n", componentName)
	fmt.Printf("📍 出力先: %s\n", outputDir)
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
