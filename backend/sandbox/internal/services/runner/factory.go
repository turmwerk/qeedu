package runner

import "strings"

var registry = map[string]Runner{}

// Register adds a language runner to the global registry.
func Register(r Runner) {
	cfg := r.Config()
	registry[strings.ToLower(cfg.Language)] = r
}

// Get returns the Runner for the given language name.
func Get(language string) (Runner, error) {
	r, ok := registry[strings.ToLower(language)]
	if !ok {
		return nil, ErrUnsupportedLanguage
	}
	return r, nil
}

// SupportedLanguages returns the list of registered language names.
func SupportedLanguages() []string {
	langs := make([]string, 0, len(registry))
	for k := range registry {
		langs = append(langs, k)
	}
	return langs
}
