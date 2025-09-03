package file_operator

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"runtime"
)

type Service interface {
	GetSourceFileDir() (string, error)
	GetPathList(path string) ([]string, error)
	HasPath(path string, name string) (bool, error)
	GetPathContents(path string) ([]byte, error)
	CreateDirectory(path string) error
	CopyFile(src string, dest string) error
}

// fileOperator はServiceインターフェースの標準実装
type fileOperator struct {
}

// NewFileOperator は新しいfileOperatorのインスタンスを作成
func NewFileOperator() Service {
	return &fileOperator{}
}

// GetSourceFileDir は呼び出し元のソースファイルのディレクトリを取得する
func (f *fileOperator) GetSourceFileDir() (string, error) {
	_, callerFile, _, ok := runtime.Caller(1)
	if !ok {
		return "", fmt.Errorf("呼び出し元のファイル情報を取得できませんでした")
	}

	// ソースファイルのディレクトリを取得
	sourceDir := filepath.Dir(callerFile)
	return sourceDir, nil
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
func (f *fileOperator) CreateDirectory(path string) error {
	return os.MkdirAll(path, 0755)
}

// CopyFile はファイルをコピーする
func (f *fileOperator) CopyFile(src string, dest string) error {
	// コピー元ファイルを開く
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	// コピー先のディレクトリが存在しない場合は作成
	destDir := filepath.Dir(dest)
	if err := os.MkdirAll(destDir, 0755); err != nil {
		return err
	}

	// コピー先ファイルを作成
	destFile, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer destFile.Close()

	// ファイルをコピー
	_, err = io.Copy(destFile, sourceFile)
	if err != nil {
		return err
	}

	// ファイルの権限をコピー
	sourceInfo, err := os.Stat(src)
	if err != nil {
		return err
	}

	return os.Chmod(dest, sourceInfo.Mode())
}
