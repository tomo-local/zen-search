package prompt

import (
	"github.com/AlecAivazis/survey/v2"
)

type Service interface {
	Input(message string, defaultValue string, helpText string) (string, error)
	Select(message string, options []string, defaultOption string) (string, error)
	Confirm(message string, defaultValue bool) (bool, error)
	MultiSelect(message string, options []string, defaultOptions []string) ([]string, error)
	Password(message string, helpText string) (string, error)
	InputWithValidation(message string, validator func(string) error) (string, error)
}

type PromptOperator struct{}

func NewPromptOperator() *PromptOperator {
	return &PromptOperator{}
}

// テキスト入力
func (p *PromptOperator) Input(message string, defaultValue string, helpText string) (string, error) {
	var result string
	prompt := &survey.Input{
		Message: message,
		Default: defaultValue,
		Help:    helpText,
	}
	err := survey.AskOne(prompt, &result)
	return result, err
}

// 選択肢から選択
func (p *PromptOperator) Select(message string, options []string, defaultOption string) (string, error) {
	var result string
	prompt := &survey.Select{
		Message: message,
		Options: options,
		Default: defaultOption,
	}
	err := survey.AskOne(prompt, &result)
	return result, err
}

// 確認プロンプト
func (p *PromptOperator) Confirm(message string, defaultValue bool) (bool, error) {
	var result bool
	prompt := &survey.Confirm{
		Message: message,
		Default: defaultValue,
	}
	err := survey.AskOne(prompt, &result)
	return result, err
}

// 複数選択
func (p *PromptOperator) MultiSelect(message string, options []string, defaultOptions []string) ([]string, error) {
	var result []string
	prompt := &survey.MultiSelect{
		Message: message,
		Options: options,
		Default: defaultOptions,
	}
	err := survey.AskOne(prompt, &result)
	return result, err
}

// パスワード入力
func (p *PromptOperator) Password(message string, helpText string) (string, error) {
	var result string
	prompt := &survey.Password{
		Message: message,
		Help:    helpText,
	}
	err := survey.AskOne(prompt, &result)
	return result, err
}

// バリデーション付きテキスト入力
func (p *PromptOperator) InputWithValidation(message string, validator func(string) error) (string, error) {
	var result string
	prompt := &survey.Input{
		Message: message,
	}

	surveyValidator := func(ans interface{}) error {
		if str, ok := ans.(string); ok {
			return validator(str)
		}
		return nil
	}

	err := survey.AskOne(prompt, &result, survey.WithValidator(survey.Required), survey.WithValidator(surveyValidator))
	return result, err
}
