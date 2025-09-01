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
	serviceName string
	outputPath  string
)

// rootCmd はベースコマンドを表します
var rootCmd = &cobra.Command{
	Use:   "service-generator",
	Short: "サービステンプレート生成ツール 🚀",
	Long: `指定されたサービス名でテンプレートファイルを生成するツールです。

このツールは templates/ ディレクトリから .tmpl ファイルを読み取り、
指定された出力先に TypeScript ファイルとして生成します。`,
	Example: `  service-generator generate -n my-service
  service-generator generate -n auth -p src/api/services
  service-generator generate --name payment --path custom/services`,
}

// generateCmd はサービス生成コマンドを表します
var generateCmd = &cobra.Command{
	Use:   "generate",
	Short: "サービスファイルを生成します ✨",
	Long: `指定されたサービス名でテンプレートファイルを生成します。

テンプレートファイル（.tmpl）は TypeScript ファイル（.ts）として
指定された出力先ディレクトリに生成されます。`,
	Run: generateService,
}

func init() {
	// generateコマンドにフラグを追加
	generateCmd.Flags().StringVarP(&serviceName, "name", "n", "", "サービス名を指定してください（必須）")
	generateCmd.Flags().StringVarP(&outputPath, "path", "p", "src/services", "出力先のベースパスを指定してください")

	// nameフラグを必須に設定
	generateCmd.MarkFlagRequired("name")

	// rootコマンドにgenerateコマンドを追加
	rootCmd.AddCommand(generateCmd)
}

func generateService(cmd *cobra.Command, args []string) {
	fmt.Printf("🎯 サービス名: %s でテンプレートをコピーします...\n", serviceName)
	fmt.Printf("📁 出力先ベースパス: %s\n", outputPath)

	// file_operatorのインスタンスを作成
	fileOp := file_operator.NewFileOperator()

	// テンプレートディレクトリのパス
	templatesDir := "templates"

	// 出力先ディレクトリのパス（指定されたパス配下にサービス名のディレクトリを作成）
	var outputDir string
	if filepath.IsAbs(outputPath) {
		// 絶対パスの場合はそのまま使用
		outputDir = filepath.Join(outputPath, serviceName)
	} else {
		// 相対パスの場合はプロジェクトルートからの相対パスとして扱う
		outputDir = filepath.Join("..", "..", outputPath, serviceName)
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

	// 各テンプレートファイルをコピー
	for _, templateFile := range templateFiles {
		if !strings.HasSuffix(templateFile, ".tmpl") {
			continue // .tmplファイル以外はスキップ
		}

		// テンプレートファイルのパス
		srcPath := filepath.Join(templatesDir, templateFile)

		// 出力ファイル名（.tmplを.tsに変更）
		outputFileName := strings.TrimSuffix(templateFile, ".tmpl")
		destPath := filepath.Join(outputDir, outputFileName)

		// ファイルをコピー
		if err := fileOp.CopyFile(srcPath, destPath); err != nil {
			log.Printf("❌ ファイル %s のコピーに失敗しました: %v", templateFile, err)
			continue
		}

		fmt.Printf("  ✅ %s -> %s\n", srcPath, destPath)
	}

	fmt.Printf("\n🎉 サービス '%s' のテンプレートファイルのコピーが完了しました！\n", serviceName)
	fmt.Printf("📍 出力先: %s\n", outputDir)
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
