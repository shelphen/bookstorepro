<!DOCTYPE html>
<html>
    <head>
        <title>Book Manager</title>
        <!--<link rel="stylesheet" href="{{elixir('css/app.css')}}">-->
        <base href="/"/>
        <link rel="stylesheet" href="{{ asset('css/bootstrap.min.css') }} ">
        <!--<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">-->
        <link rel="stylesheet" href="{{ asset('css/font-awesome.min.css') }} ">
        <link rel="stylesheet" href="{{ asset('css/prettyPhoto.css') }} ">
        <link rel="stylesheet" href="{{ asset('css/price-range.css') }}">
        <link rel="stylesheet" href="{{ asset('css/animate.css') }}">
        <link rel="stylesheet" href="{{ asset('css/main.css') }}">
        <link rel="stylesheet" href="{{ asset('css/responsive.css') }}">
        <style>
            .alertify-logs.center {
                left: 0;
                width: 100%;
                /*border: 2px solid black;*/
                margin-top:2%;
            }
            .alertify-logs.center > .default,
            .alertify-logs.center > .success,
            .alertify-logs.center > .error {
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
            }

            .loading-placeholder-wrapper {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: table;
            }
            .loading-placeholder-wrapper .loading-placeholder-inner-wrapper {
                display: table-cell;
                vertical-align: middle;
                text-align: center;
            }
            .loading-placeholder-wrapper .loading-placeholder-inner-wrapper .loading-placeholder {
                display: inline-block;
                font-size: 40px;
                font-weight: 300;
                color: #949494;
            }
        </style>
    </head>
    <body>
       

        
        @yield('layout')
        

        @if (Config::get('app.debug'))
            <script type="text/javascript">
                document.write('<script src="//localhost:35729/livereload.js?snipver=1" type="text/javascript"><\/script>')
            </script>
        @endif

        

       <script src="{{ asset('js/jquery.js') }}"></script>
       <script src="{{ asset('js/bootstrap.min.js') }}"></script>
       <!--<script src="{{ asset('js/bootstrap/ng2-bootstrap.min.js') }}"></script>-->
       <script src="{{ asset('js/jquery.scrollUp.min.js') }}"></script>
       <script src="{{ asset('js/price-range.js') }}"></script>
       <script src="{{ asset('js/jquery.prettyPhoto.js') }}"></script>
       <script src="{{ asset('js/underscore-min.js') }}"></script>
       <script src="{{ asset('js/loader.js') }}"></script>
       <script src="{{ asset('js/ng-modal.js') }}"></script>
       <script src="{{ asset('js/ng2-bs3-modal.js') }}"></script>-->
       <script src="{{ asset('js/main.js') }}"></script>
        <script>  
        !important: You want to give this variable(var googleLoaded = false;). This is used to run multiple chart in your jade.
            var googleLoaded = false;
        </script>
    </body>
</html>
