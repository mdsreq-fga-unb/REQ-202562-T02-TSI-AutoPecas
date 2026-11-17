class DomainError(Exception):
    def __init__(self, message: str, status_code: int = 422, **details: object) -> None:
        self.status_code = status_code
        self.detail = {"message": message, **details}
        super().__init__(message)
