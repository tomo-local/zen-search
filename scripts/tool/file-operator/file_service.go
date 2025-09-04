package file

import (
	"os"
	fileOperator "util/file-operator"
)

type Service interface {
	GetRepositoryRootDir() (string, error)
	GetPathList(path string) ([]string, error)
	HasPath(path string, name string) (bool, error)
	GetPathContents(path string) ([]byte, error)
	CreateDirectory(path string, perm *os.FileMode) error
	WriteFileContents(path string, contents []byte, perm *os.FileMode) error
}

type service struct {
	client fileOperator.Service
}

func New(client fileOperator.Service) (Service, error) {
	return &service{
		client: client,
	}, nil
}

func (s *service) GetRepositoryRootDir() (string, error) {
	return s.client.GetRepositoryRootDir()
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
