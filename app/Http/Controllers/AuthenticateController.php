<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\User;


class AuthenticateController extends Controller
{

    protected $user;

    public function __construct(User $user){
        $this->middleware('jwt.auth', ['except' => ['authenticate']]);
        $this->user = $user;
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
        try {

            if (! $user = \JWTAuth::parseToken()->authenticate()) {
                return response()->json(['message' => 'user_not_found'], 404);
            }

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['message' => 'token_expired'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['message' => 'token_invalid'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['message' => 'token_absent'], $e->getStatusCode());

        }
        
        // the token is valid and we have found the user via the sub claim
        return response()->json(compact('user'));
    }

    /**
     * Logout the specified user from the app.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function logout($id)
    {
        
        if( $user = $this->user->where('id',$id)->first() ){
            \JWTAuth::invalidate( \JWTAuth::getToken() );
            return response()->json(['success' => 'user_logged_out_successfully','logout' => 'logged out'], 200);
        }
        return response()->json(['message' => 'user_not_found_with_id_' . $id], 401);

    }

    public function authenticate(Request $request){

        $credentials = $request->only('email', 'password');

        try {
            // verify the credentials and create a token for the user
            if (! $token = \JWTAuth::attempt($credentials)) {
                return response()->json(['message' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['message' => 'could_not_create_token'], 500);
        }

        //$user = $this->getAuthenticatedUser(false);
        //\Log::info($user);
        // if no errors are encountered we can return a JWT
        return response()->json(compact('token'));

    }

}
