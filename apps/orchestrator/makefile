.PHONY: help
help: ## Show this help message.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: test
test: ## Run the tests against the current version of Python.
	pytest app

.PHONY: dep-sync
dep-sync: ## Sync venv installation with 'requirements.txt' file.
	@pip-sync

.PHONY: dep-lock
dep-lock: ## Freeze deps in 'requirements.txt' file.
	@pip-compile requirements.in -o requirements.txt


.PHONY: run-docker
run-docker: ## Run the app in a docker container.
	docker-compose -f docker-compose.yml up -d

.PHONY: kill-docker
kill-docker: ## Stop the running docker container.
	docker-compose -f docker-compose.yml down