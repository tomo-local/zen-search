package code_gen

import (
	fileOperator "scripts/pkg/file-operator"
	"scripts/pkg/prompt"
	stringOperator "scripts/pkg/str-operator"
)

type Service interface {
	GenerateService(name string, outputPath string) error
	GenerateComponent(name string, outputPath string) error
}

type codeGenService struct {
	fileOperator   fileOperator.Service
	stringOperator stringOperator.Service
	promptOperator prompt.Service
}

func NewCodeGenService(fileOperator fileOperator.Service, stringOperator stringOperator.Service, promptOperator prompt.Service) Service {
	return &codeGenService{
		fileOperator:   fileOperator,
		stringOperator: stringOperator,
		promptOperator: promptOperator,
	}
}
