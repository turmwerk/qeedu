package runner

// Runner defines the contract for a language-specific code runner.
// Each language provides its own LangConfig via Config().
type Runner interface {
	Config() LangConfig
}
