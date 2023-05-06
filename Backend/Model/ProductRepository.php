<?php

namespace Vaimo\BackendInternshipTest\Model;

class ProductRepository
{
    /**
     * @return Product[]
     */
    public function getList(): array
    {
        $products = [];
        // make a list of array with 5 products that generated with random name/Sku and price then return it
        for ($i = 1; $i <= 5; $i++) {
            $product = new Product();
            $product->setName($this->generateRandomString());
            $product->setSku($this->generateRandomString());
            $product->setPrice(mt_rand(1, 100));
            $products[] = $product;
        }

        return $products;
    }

    private function generateRandomString(): string
    {

        // generate a six letter random name/Sku using all Aa-Zz and numbers
        $length = 6;
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $string = '';

        for ($i = 0; $i < $length; $i++) {
            $string .= $characters[mt_rand(0, strlen($characters) - 1)];
        }

        return $string;
    }
}
