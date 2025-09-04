package file_operator

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
)

type Service interface {
	GetRepositoryRootDir() (string, error)
	GetPathList(path string) ([]string, error)
	HasPath(path string, name string) (bool, error)
	GetPathContents(path string) ([]byte, error)
	CreateDirectory(path string, perm *os.FileMode) error
	WriteFileContents(path string, contents []byte, perm *os.FileMode) error
}

// fileOperator はServiceインターフェースの標準実装
type fileOperator struct {
}

// NewFileOperator は新しいfileOperatorのインスタンスを作成
func NewFileOperator() Service {
	return &fileOperator{}
}

func (f *fileOperator) GetPathList(path string) ([]string, error) {
	files, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	var fileList []string
	for _, file := range files {
		fileList = append(fileList, file.Name())
	}
	return fileList, nil
}

func (f *fileOperator) GetRepositoryRootDir() (string, error) {
	currentDir, err := os.Getwd()
	if err != nil {
		return "", fmt.Errorf("現在の作業ディレクトリの取得に失敗しました: %v", err)
	}

	// .git ディレクトリを探してリポジトリのルートを特定
	for {
		if _, err := os.Stat(filepath.Join(currentDir, ".git")); err == nil {
			return currentDir, nil
		}

		parentDir := filepath.Dir(currentDir)
		if parentDir == currentDir {
			break // ルートディレクトリに到達
		}
		currentDir = parentDir
	}

	return "", fmt.Errorf(".git ディレクトリが見つかりません。リポジトリのルートを特定できませんでした。")
}

// 特定のフォルダーに特定の名前のファイルやディレクトリが存在するか確認
func (f *fileOperator) HasPath(path string, name string) (bool, error) {
	fullPath := filepath.Join(path, name)
	_, err := os.Stat(fullPath)
	if err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

// GetPathContents はファイルの内容を読み込む
func (f *fileOperator) GetPathContents(path string) ([]byte, error) {
	return os.ReadFile(path)
}

// CreateDirectory はディレクトリを作成する
func (f *fileOperator) CreateDirectory(path string, perm *os.FileMode) error {
	if perm == nil {
		defaultPerm := os.FileMode(0755)
		perm = &defaultPerm
	}
	return os.MkdirAll(path, *perm)
}

// WriteFileContents はファイルに内容を書き込む ない場合は、新規作成
func (f *fileOperator) WriteFileContents(path string, contents []byte, perm *os.FileMode) error {
	if perm == nil {
		defaultPerm := os.FileMode(0644)
		perm = &defaultPerm
	}
	return os.WriteFile(path, contents, *perm)
}
