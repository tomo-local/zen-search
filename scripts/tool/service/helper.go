package service

import (
	"fmt"
	"path/filepath"
)


func (t *toolService) getTemplateFiles(targetSubDir string) ([]string, error) {
	repoRoot, err := t.fileOperator.GetRepositoryRootDir()
	if err != nil {
		return nil, fmt.Errorf("❌ リポジトリのルートディレクトリの取得に失敗しました: %v", err)
	}

	templatesDir := filepath.Join(repoRoot, targetSubDir)

	templateFiles, err := t.fileOperator.GetPathList(templatesDir)
	if err != nil {
		return nil, fmt.Errorf("❌ テンプレートファイルの取得に失敗しました: %v", err)
	}

	if len(templateFiles) == 0 {
		return nil, fmt.Errorf("❌ テンプレートファイルが存在しません: %s", templatesDir)
	}

	return templateFiles, nil
}