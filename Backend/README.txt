You will find two PHP classes inside Model/ directory: ProductRepository & Cart. Make necessary modifications to these classes so that they fulfil the following requirements:

- Method getList() in ProductRepository class should return an array of 5 objects of type Product, where each Product object has name, sku & price attributes. These attribute values should be generated randomly.
- Method getData() in Cart class should return an array of all the products added to the Cart with their quantities.
- Method getTotalPrice() in Cart class should return the sum of all the products added to the Cart.
- Method getTotalPriceInclTax() in Cart class should return the sum of all the products added to the Cart, including 25% tax.
- Method add(…) in Cart class should accept one parameter of type Product. Calling this method should add the passed Product to an array with quantity 1. If the product has been added already, then the quantity should increase by one.
- Method remove(…) in Cart class should accept one parameter of type Product. Calling this method should remove the passed Product from the array.
- Method changeQuantity(…) in Cart class should accept two parameters of type Product and int respectively. Calling this method should change the quantity of the passed Product from the array.

- Bonus: Make the PHPUnit tests pass.
    - Install the composer packages by running composer install
    - Run the PHPUnit tests: vendor/bin/phpunit Test/Unit
    - Make necessary changes to the classes in Model/ directory and run the tests again until they’re passed.
