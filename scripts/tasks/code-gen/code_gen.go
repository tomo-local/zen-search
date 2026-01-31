package codegen

import (
	fileutil "scripts/pkg/file-operator"
	"scripts/pkg/prompt"
	strutil "scripts/pkg/str-operator"
)

type Service interface {
	GenerateService(name string, outputPath string) error
	GenerateComponent(name string, outputPath string) error
}

type codeGenService struct {
	fileOperator   fileutil.Service
	stringOperator strutil.Service
	promptOperator prompt.Service
}

func NewCodeGenService(fileOperator fileutil.Service, stringOperator strutil.Service, promptOperator prompt.Service) Service {
	return &codeGenService{
		fileOperator:   fileOperator,
		stringOperator: stringOperator,
		promptOperator: promptOperator,
	}
}
