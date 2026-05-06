package strutil

import "testing"

// TODO(human): テストケースを実装してください
// 各関数（ToCamelCase, ToPascalCase, ToUpperSnakeCase）に対して
// testCases スライスを作成し、入力と期待値を定義してください

func TestToCamelCase(t *testing.T) {
	s := NewStringOperator()

	testCases := []struct {
		input string
		want  string
	}{
		// TODO(human): テストケースを追加
	}

	for _, tc := range testCases {
		t.Run(tc.input, func(t *testing.T) {
			got := s.ToCamelCase(tc.input)
			if got != tc.want {
				t.Errorf("ToCamelCase(%q) = %q, want %q", tc.input, got, tc.want)
			}
		})
	}
}

func TestToPascalCase(t *testing.T) {
	s := NewStringOperator()

	testCases := []struct {
		input string
		want  string
	}{
		// TODO(human): テストケースを追加
	}

	for _, tc := range testCases {
		t.Run(tc.input, func(t *testing.T) {
			got := s.ToPascalCase(tc.input)
			if got != tc.want {
				t.Errorf("ToPascalCase(%q) = %q, want %q", tc.input, got, tc.want)
			}
		})
	}
}

func TestToUpperSnakeCase(t *testing.T) {
	s := NewStringOperator()

	testCases := []struct {
		input string
		want  string
	}{
		// TODO(human): テストケースを追加
	}

	for _, tc := range testCases {
		t.Run(tc.input, func(t *testing.T) {
			got := s.ToUpperSnakeCase(tc.input)
			if got != tc.want {
				t.Errorf("ToUpperSnakeCase(%q) = %q, want %q", tc.input, got, tc.want)
			}
		})
	}
}
