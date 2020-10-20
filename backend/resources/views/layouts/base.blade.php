<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  {{-- 固定 --}}
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no">
  <meta property="og:site_name" content=>
  <meta property="article:publisher" content="">
  <meta property="fb:app_id" content="">
  <meta name="twitter:card" content="summary_large_image">
  <meta property="og:locale" content="ja_JP">
  <meta property="og:type" content="website">
  <!-- CSRF Token -->
  <meta name="csrf-token" content="{{ csrf_token() }}">

  {{-- NotoSansJP, Barlow --}}
  <link href="https://fonts.googleapis.com/css?family=Barlow+Semi+Condensed:600|Noto+Sans+JP:400,500,700&display=swap&subset=japanese" rel="stylesheet">

  {{-- 変動（変数が必要） --}}
  <title>{{ config('app.name', 'Laravel') }}</title>
  <meta name="description" content="">
  <meta property="og:title" content="{{ config('app.name', 'Laravel') }}">
  <meta name="twitter:title" content="{{ config('app.name', 'Laravel') }}">
  <meta property="og:url" content="">
  <meta name="twitter:site" content="">
  <meta name="twitter:creator" content="">
    {{-- ページごとにキーワードが追加されたりする --}}
  <meta name="keyword" content="">
  <meta property="og:image" content="">
  <meta property="og:image" content="">
  <meta name="description" content="">
  <meta property="og:description" content="">
  <meta name="twitter:description" content="">

  {{-- 以下アドタグ・アナリティクス関係 --}}

  <!-- Insert: DFP -->
  <script async="async" src="https://www.googletagservices.com/tag/js/gpt.js"></script>
  <script>
    var googletag = googletag || {};
    googletag.cmd = googletag.cmd || [];
  </script>

</head>
<body>

  {{-- body --}}


</body>
  <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
  <script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"></script>
</html>
