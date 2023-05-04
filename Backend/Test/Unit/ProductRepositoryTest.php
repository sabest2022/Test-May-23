<?php

namespace Vaimo\BackendInternshipTest\Test\Unit;

use PHPUnit\Framework\TestCase;
use Vaimo\BackendInternshipTest\Model\Product;
use Vaimo\BackendInternshipTest\Model\ProductRepository;

class ProductRepositoryTest extends TestCase
{
    /**
     * @var ProductRepository
     */
    private ProductRepository $model;

    protected function setUp(): void
    {
        $this->model = new ProductRepository();
    }

    /**
     * @return array
     */
    public function testGetListReturnsProducts(): array
    {
        $products = $this->model->getList();

        $this->assertIsArray($products);
        $this->assertCount(5, $products);
        $this->assertInstanceOf(Product::class, $products[0]);

        return $products;
    }

    /**
     * @depends testGetListReturnsProducts
     * @param Product[] $products
     * @return void
     */
    public function testProductAttributes(array $products)
    {
        foreach ($products as $product) {
            $this->assertNotEmpty($product->getName());
            $this->assertNotEmpty($product->getSku());
            $this->assertNotEmpty($product->getPrice());
        }
    }
}
