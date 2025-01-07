# docusaurus-login-interface-with-laravel
This repository is an example of how to create a connection interface to protect your docusaurus using your pre-existing Laravel identifiers.
This repository is an example, there may be flaws / bugs, I invite you to improve before deploying it on your own project.
You can make a Pull Request if you think your modifications could be useful to everyone.

## Docusaurus Files

The contents of the repository correspond to the files to be included in your Docusaurus project. The configuration files are not complete, so I leave it up to you to include the parts you need to modify in your configuration.

## Laravel

C'est très simple pour Laravel, il y a que quelques fichiers a modifié et un a crée. Pour notre cas, on est passé par `Laravel sancutm`, je vous laisse le soin de l'ajouter à votre Laravel.

> Modify `routes/api.php`

```php 
use App\Api\Controllers\AuthDocusaurus\AuthDocusaurusController;

...

/** START ROUTES DOCUSAURUS */
Route::post('/docu/login', [AuthDocusaurusController::class, 'login']);
Route::get('/docu/logout', [AuthDocusaurusController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/docu/valid', [AuthDocusaurusController::class, 'valid'])->middleware('auth:sanctum');
/** END ROUTES DOCUSAURUS */

...
```

> Create `AuthDocusaurusController.php` (only for Api, no model)

```php
<?php
namespace ..\..\..\AuthDocusaurus;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthDocusaurusController extends Controller
{
    const DOCUSAURUS_TOKEN_NAME = 'docusaurus';
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        $credentials = $request->only('email', 'password');
        if (!Auth::attempt($credentials)) {

            return response()->json([
                'message' => 'Invalid login details'
            ], 401);
        }
        $user = User::where('email', $request->email)->firstOrFail();
        if ($user->role->value != 'admin') {

            return response()->json([
                'message' => 'The user is not authorised'
            ], 401);
        }
        $user->tokens()->where('name', self::DOCUSAURUS_TOKEN_NAME)->delete();
        $token = $user->createToken(self::DOCUSAURUS_TOKEN_NAME, [])->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens->where('name', self::DOCUSAURUS_TOKEN_NAME)->each(function ($token) {
            $token->delete();
        });

        return response()->json(['message' => 'Successfully disconnected']);
    }

    public function valid(Request $request)
    {
        return response()->json(["status" => !!$request->user()->email]);
    }
}
```

> Modify configuration `App\Http\Kernel.php`

```php
...

protected $middlewareGroups = [
  'web' => [...]
  'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
  ],
];

...
```

> Modify `.env` of Laravel (this is an exemle for localhost, localhost:3000 = Docusaurus, laravel.local = Laravel, both are on my local)

```
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000,laravel.local
```

> Guards Api is in Token mode, `.\config\auth.php`

```php
...
'guards' => [
  'web' => [...],
  'api' => [
    ...
    'driver' => 'token',
    ...
  ],
],
...
```

```bash
composer clear
```

If Somthing wrong please let me know with new issue, see if your problems not already added in the list.
