package service

import (
	"fmt"
	"path/filepath"
	"strings"
)

func (t *toolService) GenerateComponent(name string, outputPath string) error {
	var componentName string
	var componentType string
	var fullOutputPath string

	// フラグで引数が渡された場合
	if name != "" && outputPath != "" {
		componentName = t.stringOperator.ToPascalCase(name)
		fullOutputPath = outputPath
		fmt.Printf("✨ 引数指定モード: %s -> %s\n", name, componentName)
	} else {
		// プロンプトモードで入力を取得
		selectedType, err := t.promptOperator.Select("Component の種類を選択してください", []string{"modals", "widgets"}, "widgets")
		if err != nil {
			return fmt.Errorf("❌ Component の種類の選択に失敗しました: %v", err)
		}

		componentType = selectedType
		fmt.Printf("🛠 選択された Component の種類: %s\n", componentType)

		// コンポーネント名を入力
		inputName, err := t.promptOperator.InputWithValidation(
			"コンポーネント名を入力してください（PascalCaseに自動変換されます）",
			func(input string) error {
				err := t.validateComponentName(input, componentType)
				if err != nil {
					return err
				}

				return nil
			},
		)

		if err != nil {
			return fmt.Errorf("❌ コンポーネント名の入力に失敗しました: %v", err)
		}

		// PascalCase に変換
		componentName = t.stringOperator.ToPascalCase(inputName)
		fmt.Printf("✨ PascalCase変換後: %s\n", componentName)

		// 出力パス設定
		repoRoot, err := t.fileOperator.GetRepositoryRootDir()
		if err != nil {
			return fmt.Errorf("❌ リポジトリのルートディレクトリの取得に失敗しました: %v", err)
		}
		fullOutputPath = filepath.Join(repoRoot, "src/components", componentType, componentName)
	}

	// コンポーネントディレクトリの作成
	if err := t.createComponentDirectory(fullOutputPath); err != nil {
		return err
	}

	// テンプレートファイルの処理
	if templateFiles, err := t.getTemplateFiles("templates/components"); err != nil {
		return err
	}

	for _, file := range templateFiles {
		if !strings.HasSuffix(file, ".tmpl") {
			continue
		}

		if err := t.processSingleTemplate(templatesDir, templateFile, componentName, fullOutputPath); err != nil {
			fmt.Printf("❌ テンプレート処理失敗 (%s): %v\n", templateFile, err)
			continue
		}
	}

	fmt.Printf("🎉 コンポーネント %s を %s に生成完了！\n", componentName, fullOutputPath)
	return nil
}

func (t *toolService) validateComponentName(name string, compType string) error {
	if strings.TrimSpace(name) == "" {
		return fmt.Errorf("コンポーネント名は必須です")
	}

	if !isValidComponentName(name) {
		return fmt.Errorf("コンポーネント名は英数字、ハイフン、アンダースコアのみ使用できます")
	}

	// すでに存在するかチェック
	repoRoot, err := t.fileOperator.GetRepositoryRootDir()
	if err != nil {
		return fmt.Errorf("リポジトリのルートディレクトリの取得に失敗しました: %v", err)
	}

	componentName := t.stringOperator.ToPascalCase(name)

	fullPath := filepath.Join(repoRoot, "src/components", compType)

	exists, _ := t.fileOperator.HasPath(fullPath, componentName)
	if exists {
		return fmt.Errorf("コンポーネントは既に存在します: %s", componentName)
	}

	return nil
}

func isValidComponentName(name string) bool {
	for _, r := range name {
		if !(r >= 'a' && r <= 'z') && !(r >= 'A' && r <= 'Z') && !(r >= '0' && r <= '9') && r != '-' && r != '_' {
			return false
		}
	}
	return true
}

func (t *toolService) createComponentDirectory(fullOutputPath string) error {
	if err := t.fileOperator.CreateDirectory(fullOutputPath, nil); err != nil {
		return fmt.Errorf("❌ コンポーネントディレクトリの作成に失敗しました: %v", err)
	}
	fmt.Printf("📂 コンポーネントディレクトリを作成しました: %s\n", fullOutputPath)
	return nil
}

func (t *toolService) processSingleTemplate(templatesDir, templateFile, componentName, fullOutputPath string) error {
	srcPath := filepath.Join(templatesDir, templateFile)
	outputFileName := strings.TrimSuffix(templateFile, ".tmpl")
	outputFileName = strings.ReplaceAll(outputFileName, "Component", componentName)
	destPath := filepath.Join(fullOutputPath, outputFileName)

	content, err := t.convertToTemplateContentForComponent(srcPath, componentName)
	if err != nil {
		return err
	}

	if err := t.fileOperator.WriteFileContents(destPath, []byte(content), nil); err != nil {
		return fmt.Errorf("書き込み失敗: %v", err)
	}

	fmt.Printf("  ✅ %s -> %s\n", templateFile, outputFileName)
	return nil
}

// 戻り値をstringに変更 🔧
func (t *toolService) convertToTemplateContentForComponent(path string, name string) (string, error) {
	content, err := t.fileOperator.GetPathContents(path)
	if err != nil {
		return "", fmt.Errorf("テンプレートファイルの読み込み失敗 (%s): %v", path, err)
	}

	result := strings.ReplaceAll(string(content), "{{.Component}}", name)
	return result, nil
}
