<?php

namespace Vaimo\BackendInternshipTest\Model;

class Cart
{
    private array $items = [];

    public function add(Product $product)
    {
        // checking if product exist in cart, in this case incrementing qty otherwise add the product to Cart
        foreach ($this->items as &$item) {
            if ($item['product'] === $product) {
                $item['qty']++;
                return;
            }
        }
        $this->items[] = ['product' => $product, 'qty' => 1];
    }

    public function remove(Product $product)
    {
        // finding the product in Cart, if exist then unset and remove from the cart
        foreach ($this->items as $key => $item) {
            if ($item['product'] === $product) {
                unset($this->items[$key]);
                break;
            }
        }
    }

    public function changeQuantity(Product $product, int $qty)
    {
        // find a product and change the qty, but if new qty is equal zero, it unset/removes the product from the Cart
        foreach ($this->items as $key => $item) {
            if ($item['product'] === $product) {
                $this->items[$key]['qty'] = $qty;
                if ($qty == 0) {
                    unset($this->items[$key]);
                    break;
                }
            }
        }
    }

    public function getData(): array
    {
        // this return all product in the Cart as an array 
        return $this->items;
    }

    public function getTotalPrice(): float
    {
        // go through all products, calculate price times to qty and return the total price
        $total = 0;

        foreach ($this->items as $item) {
            $total += $item['product']->getPrice() * $item['qty'];
        }

        return $total;
    }

    public function getTotalPriceInclTax(): float
    {
        // uses the getTotalPrice, calculate the tax and return the total price tax included
        $total = $this->getTotalPrice();
        $tax = $total * 0.25;
        return $total + $tax;
    }
}
