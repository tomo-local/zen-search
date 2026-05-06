# Service Rules

## Creating a New Service

When creating a new service, always use the code generation script instead of creating files manually.

```bash
# Generate a new service (outputs to src/services/<name>/ by default)
cd scripts && go run main.go gen service --name <ServiceName>

# Generate a new service at a custom path
cd scripts && go run main.go gen service --name <ServiceName> --path <output-path>
```

After generation, edit the generated files to implement the actual logic.

@.claude/rules/service-architecture.md
