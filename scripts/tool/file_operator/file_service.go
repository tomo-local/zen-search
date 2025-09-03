package file_service

import (
	"os"
	file_operator "util/file_operator"
)

type Service interface {
	GetSourceFileDir() (string, error)
	GetPathList(path string) ([]string, error)
	HasPath(path string, name string) (bool, error)
	GetPathContents(path string) ([]byte, error)
	CreateDirectory(path string, perm *os.FileMode) error
	WriteFileContents(path string, contents []byte, perm *os.FileMode) error
}

type service struct {
	client file_operator.Service
}

func New(fileOperator file_operator.Service) (Service, error) {
	return &service{
		client: fileOperator,
	}, nil
}

func (s *service) GetSourceFileDir() (string, error) {
	return s.client.GetSourceFileDir()
}

func (s *service) GetPathList(path string) ([]string, error) {
	return s.client.GetPathList(path)
}

func (s *service) HasPath(path string, name string) (bool, error) {
	return s.client.HasPath(path, name)
}

func (s *service) GetPathContents(path string) ([]byte, error) {
	return s.client.GetPathContents(path)
}

func (s *service) CreateDirectory(path string, perm *os.FileMode) error {
	return s.client.CreateDirectory(path, perm)
}

func (s *service) WriteFileContents(path string, contents []byte, perm *os.FileMode) error {
	return s.client.WriteFileContents(path, contents, perm)
}
