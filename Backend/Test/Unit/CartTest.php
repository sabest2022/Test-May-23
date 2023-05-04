<?php

namespace Vaimo\BackendInternshipTest\Test\Unit;

use PHPUnit\Framework\TestCase;
use Vaimo\BackendInternshipTest\Model\Cart;
use Vaimo\BackendInternshipTest\Model\Product;

class CartTest extends TestCase
{
    /**
     * @var Cart
     */
    private Cart $model;

    protected function setUp(): void
    {
        $this->model = new Cart();
    }

    /**
     * @return Cart
     */
    public function testCartInteraction(): Cart
    {
        $product1 = new Product();
        $product1->setSku('TEST-1');
        $product1->setPrice(99.0);

        $product2 = new Product();
        $product2->setSku('TEST-2');
        $product2->setPrice(149.95);

        $product3 = new Product();
        $product3->setSku('TEST-3');
        $product3->setPrice(59.75);

        $product4 = new Product();
        $product4->setSku('TEST-4');
        $product4->setPrice(79.90);

        $this->model->add($product1);
        $this->model->add($product1);
        $this->model->add($product2);
        $this->model->changeQuantity($product1, 0);
        $this->model->changeQuantity($product2, 1);
        $this->model->add($product3);
        $this->model->remove($product3);
        $this->model->add($product4);
        $this->model->changeQuantity($product4, 5);

        $cartData = $this->model->getData();
        $this->assertCount(2, $cartData);
        return $this->model;
    }

    /**
     * @depends testCartInteraction
     * @param Cart $cart
     * @return void
     */
    public function testTotalPrice(Cart $cart)
    {
        $this->assertEquals(549.45, $cart->getTotalPrice());
    }

    /**
     * @depends testCartInteraction
     * @param Cart $cart
     * @return void
     */
    public function testTotalPriceInclTax(Cart $cart)
    {
        $this->assertEquals(686.8125, $cart->getTotalPriceInclTax());
    }
}
