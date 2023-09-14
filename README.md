# Kapu's Playground

An interactive storefront for Kapu: a playground and shop where you watch caterpillars munch and slide glass.

## Libraries + Frameworks

- `Hydrogen`: Shopify's framework that contains Remix optimized components and integrated Storefront API
- `Remix`: for smooth data fetching and rendering
- `GraphQL`: for querying Shopify data
- `p5.js`: for its neat vector math support
- `Rough.js`: for the hipness purgatory look
- `TailwindCSS`: for styling
- `React`
- `Node.js`
- `JavaScript`

## Interaction

#### Scroll and slide

![cloud](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExamhnaDkybWowczhucWN0NHJ5cXdjNHN4N3JraGttOGtjNG5mcHloMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BXqvz19RM2Cyllpe3m/giphy-downsized-large.gif)
![star](https://media.giphy.com/media/YnRDIyuNwBOud2qYQT/giphy-downsized.gif)

Every collection page features a different slide and illustrations. Only 3 products are displayed at a time, and to view other products, you'd have to scroll or drag on the little caterpillar UI at the bottom. 

Each slide shape is saved in an SVG, so the positions on slide can be obtained by calling `getPointAtLength`.

#### Caterpillars

![caterpillars](https://i.giphwy.com/media/BHL1gJGg0hPI8Gt881/giphy-downsized-large.gif)

Caterpillars "munch" at the featured images on the homepage. 

The caterpillars search for nontransparent pixels in their proximity and move towards colors, or simply pick random direction if it's in the wild (no colored pixels around). Their movements are stored in a buffer and used to mask another buffer of featured images. The result is then rendered directly on the homepage.

#### Butterfly cursor

![butterfly](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3VvenV0ZHFzdG9hYXI1NTcydHRoc2VhYW0wbnV4NzN0NTFuZDFnayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/q08qjGDYc2zhDc78i1/giphy.gif)

There's a shape shifting butterfly, procedurally generated with p5.js, that follows the mouse on web.

