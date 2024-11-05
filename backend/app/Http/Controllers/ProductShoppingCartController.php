<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ShoppingCart;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProductShoppingCartController extends Controller
{
    public function index(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        // Lấy danh sách giỏ hàng của người dùng với thông tin sản phẩm
        $cartList = $user->cartItems()
            ->with('product')
            ->orderBy('id', 'desc')
            ->get();

        return $cartList;
    }

    public function store(Request $request)
    {
        $request->validate([
            'productId' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric'
        ]);

        $user = JWTAuth::parseToken()->authenticate();

        // Lưu item vào giỏ hàng
        $item = $user->cartItems()->where('product_id', $request->productId)->first();

        if (!$item) {
            ShoppingCart::create([
                'user_id' => $user->id,
                'product_id' => $request->productId,
                'quantity' => $request->quantity,
                'price' => $request->price // Lưu giá vào giỏ hàng
            ]);
            return response()->json(['message' => 'Sản phẩm đã được thêm vào giỏ hàng thành công.']);
        } else {
            $item->increment('quantity', $request->quantity);
            return response()->json(['message' => 'Số lượng sản phẩm trong giỏ hàng đã được cập nhật.']);
        }
    }



    public function guestCart(Request $request)
    {
        $cartList = json_decode($request['cartList'], true);

        $data = [];
        $count = 1;
        foreach ($cartList as $cartArrayList) {
            foreach ($cartArrayList as $cartItem) {
                if ($cartItem['product_id'] != null || $cartItem['quantity'] != null) {
                    $product = Product::where('id', $cartItem['product_id'])->first();
                    $data[] = [
                        'id' => $count,
                        'product_id' => $cartItem['product_id'],
                        'quantity' => $cartItem['quantity'],
                        'product' => $product,
                        'price' => $cartItem['price']
                    ];
                    $count++;
                }
            }
        }

        return $data;
    }

    public function update(Request $request, $id)
    {
        $cartItem = ShoppingCart::with('product')->where('id', $id)->first();

        // Kiểm tra số lượng tồn kho của sản phẩm và cập nhật
        if ($request->quantity <= $cartItem->product->stock_quantity && $request->quantity > 0) {
            $cartItem->update(['quantity' => $request->quantity]);
        }
    }

    public function destroy($id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['message' => 'Người dùng chưa xác thực'], 401);
            }

            // Tìm sản phẩm trong giỏ hàng của người dùng
            $cartItem = $user->cartItems()->find($id);

            if (!$cartItem) {
                return response()->json(['message' => 'Sản phẩm không tồn tại trong giỏ hàng'], 404);
            }

            // Xóa sản phẩm khỏi giỏ hàng
            $cartItem->delete();
            return response()->json(['message' => 'Đã xóa sản phẩm khỏi giỏ hàng thành công'], 200);

        } catch (\Exception $e) {
            // Xử lý lỗi không xác định
            return response()->json(['message' => 'Có lỗi xảy ra, vui lòng thử lại.'], 500);
        }
    }


    public function cartCount(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        return $user->cartItems()->pluck('product_id')->toArray();
    }
}
