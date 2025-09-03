package service

import (
	"fmt"
	"log"
	"path/filepath"
	"strings"
)

func (t *toolService) GenerateService(serviceName string, outputPath string) error {
	fmt.Printf("🎯 サービス名: %s でテンプレートをコピーします...\n", serviceName)
	fmt.Printf("📁 出力先ベースパス: %s\n", outputPath)

	// 実行可能ファイルのディレクトリを取得
	execDir, err := t.fileOperator.GetSourceFileDir()
	if err != nil {
		return fmt.Errorf("❌ 実行可能ファイルのディレクトリ取得に失敗しました: %v", err)
	}

	log.Printf("🔍 実行可能ファイルのディレクトリ: %s\n", execDir)

	// テンプレートディレクトリのパス（実行可能ファイルから相対的に取得）
	templatesDir := filepath.Join(execDir, "..", "templates")

	// 出力先ディレクトリのパス（指定されたパス配下にサービス名のディレクトリを作成）
	outputDir := filepath.Join(execDir, "../../..", outputPath, serviceName)

	// 出力ディレクトリが存在するかチェック
	exists, err := t.fileOperator.HasPath(filepath.Dir(outputDir), filepath.Base(outputDir))

	if err != nil {
		return fmt.Errorf("❌ ディレクトリの確認でエラーが発生しました: %v", err)
	}

	if exists {
		fmt.Printf("⚠️  警告: ディレクトリ %s は既に存在します。\n", outputDir)
	}

	// 出力ディレクトリを作成
	if err := t.fileOperator.CreateDirectory(outputDir); err != nil {
		return fmt.Errorf("❌ 出力ディレクトリの作成に失敗しました: %v", err)
	}
	fmt.Printf("📂 出力ディレクトリを作成しました: %s\n", outputDir)

	// テンプレートファイルの一覧を取得
	templateFiles, err := t.fileOperator.GetPathList(templatesDir)
	if err != nil {
		return fmt.Errorf("❌ テンプレートディレクトリの読み取りに失敗しました: %v", err)
	}

	fmt.Println("\n📝 ファイルをコピー中...")

	// 各テンプレートファイルをコピー
	for _, templateFile := range templateFiles {
		if !strings.HasSuffix(templateFile, ".tmpl") {
			continue
		}

		// テンプレートファイルのパス
		srcPath := filepath.Join(templatesDir, templateFile)

		// 出力ファイル名（.tmplを.tsに変更）
		outputFileName := strings.TrimSuffix(templateFile, ".tmpl")
		destPath := filepath.Join(outputDir, outputFileName)

		// ファイルをコピー
		if err := t.fileOperator.CopyFile(srcPath, destPath); err != nil {
			return fmt.Errorf("❌ ファイルのコピーに失敗しました (%s -> %s): %v", srcPath, destPath, err)
		}

		fmt.Printf("  ✅ %s -> %s\n", srcPath, destPath)
	}

	fmt.Printf("\n🎉 サービス '%s' のテンプレートファイルのコピーが完了しました！\n", serviceName)
	fmt.Printf("📍 出力先: %s\n", outputDir)

	return nil
}
