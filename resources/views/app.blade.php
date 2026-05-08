<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
<<<<<<< HEAD
        <meta name="csrf-token" content="{{ csrf_token() }}">
=======
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        
        @viteReactRefresh
        @vite(['resources/js/app.jsx', 'resources/css/app.css'])
        @inertiaHead
    </head>
    <body class="antialiased">
        @inertia
    </body>
</html>
