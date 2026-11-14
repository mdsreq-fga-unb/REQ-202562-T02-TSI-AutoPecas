import base64
import binascii
import warnings
from io import BytesIO

from PIL import Image, ImageOps, UnidentifiedImageError

from app.core.errors import DomainError

MAX_PHOTO_BYTES = 2 * 1024 * 1024


def validate_photo(data: str | None) -> tuple[bytes | None, str | None]:
    if not data:
        return None, None
    formats = {"image/jpeg": "JPEG", "image/png": "PNG", "image/webp": "WEBP"}
    try:
        header, encoded = data.split(",", 1)
        media_type = header.removeprefix("data:").removesuffix(";base64")
        if header != f"data:{media_type};base64" or media_type not in formats:
            raise ValueError
        raw = base64.b64decode(encoded, validate=True)
        if len(raw) > MAX_PHOTO_BYTES:
            raise ValueError
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(BytesIO(raw)) as photo:
                if photo.format != formats[media_type] or photo.width * photo.height > 12_000_000:
                    raise ValueError
                # Reencodificação remove metadados e conteúdo que não pertence à imagem.
                output = BytesIO()
                ImageOps.exif_transpose(photo).save(output, format=formats[media_type])
                if output.tell() > MAX_PHOTO_BYTES:
                    raise ValueError
                return output.getvalue(), media_type
    except (
        ValueError,
        OSError,
        binascii.Error,
        UnidentifiedImageError,
        Image.DecompressionBombError,
        Image.DecompressionBombWarning,
    ) as exc:
        raise DomainError(
            "Envie uma foto JPG, PNG ou WebP de até 2 MB e 12 megapixels.",
            fields={"photo_data": "Foto inválida ou acima do limite permitido."},
        ) from exc
