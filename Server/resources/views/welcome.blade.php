<!DOCTYPE html>
<html>
<head>
    <title>Multiple File Upload</title>
</head>
<body>
    <form action="" method="post" enctype="multipart/form-data">
        @csrf
        <input type="file" name="files[]" multiple>
        <button type="submit">Upload</button>
    </form>
</body>
</html>