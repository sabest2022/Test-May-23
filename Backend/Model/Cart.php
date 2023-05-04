<?php

namespace Vaimo\BackendInternshipTest\Model;

class Cart
{
    /**
     * TODO: Calling this method should add the passed Product to an array with quantity 1.
     *  If the product has been added already, then the quantity should increase by one.
     *
     * @param Product $product
     * @return void
     */
    public function add(Product $product)
    {

    }

    /**
     * TODO: Calling this method should remove the passed Product from the array
     *
     * @param Product $product
     * @return void
     */
    public function remove(Product $product)
    {

    }

    /**
     * TODO: Calling this method should change the quantity of the passed Product from the array.
     *
     * @param Product $product
     * @param int $qty
     * @return void
     */
    public function changeQuantity(Product $product, int $qty)
    {

    }

    /**
     * TODO: Return an array of all the products added to the Cart with their quantities.
     *  Array must have the following format:
     *  [
     *      [
     *          'product' => Product object,
     *          'qty' => Product quantity in integer
     *      ],
     *      ...
     *  ]
     *
     *
     * @return array
     */
    public function getData(): array
    {

    }

    /**
     * TODO: Return the sum of all the products added to the Cart
     *
     * @return float
     */
    public function getTotalPrice(): float
    {

    }

    /**
     * TODO: Return the sum of all the products added to the Cart, including 25% tax
     *
     * @return float
     */
    public function getTotalPriceInclTax(): float
    {

    }
}
