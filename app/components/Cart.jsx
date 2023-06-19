import {Link, useFetcher} from '@remix-run/react';
import {flattenConnection, Image, Money} from '@shopify/hydrogen-react';

export function CartLineItems({linesObj}) {
  const lines = flattenConnection(linesObj);
  return (
    <div className="space-y-8">
      {lines.map((line) => {
        return <LineItem key={line.id} lineItem={line} />;
      })}
    </div>
  );
}

export function CartSummary({cost}) {
    return (
      <>
        <dl className="space-y-2">
          <div className="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd>
              {cost?.subtotalAmount?.amount ? (
                <Money withoutTrailingZeros data={cost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </dd>
          </div>
        </dl>
      </>
    );
  }
  
  export function CartActions({checkoutUrl}) {
    if (!checkoutUrl) return null;
  
    return (
      <div className="flex flex-col mx-auto">
        <a
        target='_blank'
          href={checkoutUrl}
          className="border-[#000000] border-[1px] py-1 px-2 font-medium hover:bg-black hover:text-white"
        >
          Continue to Checkout
        </a>
      </div>
    );
  }
  

function LineItem({lineItem}) {
  const {merchandise, quantity} = lineItem;

  return (
    <div className="flex gap-4">
      <Link
        to={`/products/${merchandise.product.handle}`}
        className="flex-shrink-0"
      >
        <Image data={merchandise.image} width={110} height={110} />
      </Link>
      <div className="flex-1 flex flex-col">
        <Link
          to={`/products/${merchandise.product.handle}`}
          className="no-underline hover:text-black text-lg flex grow"
        >
          {merchandise.product.title}
        </Link>
        {/* <h2>{merchandise.selectedOptions.name}</h2> */}
        <div className="text-gray-800 text-sm">Qty: {quantity}</div>
        <ItemRemoveButton className="self-end" lineIds={[lineItem.id]} />
      </div>
      <Money className="" withoutTrailingZeros data={lineItem.cost.totalAmount} />
    </div>
  );
}

function ItemRemoveButton({lineIds}) {
    const fetcher = useFetcher();
  
    return (
      <fetcher.Form action="/cart" method="post">
        <input type="hidden" name="cartAction" value="REMOVE_FROM_CART" />
        <input type="hidden" name="linesIds" value={JSON.stringify(lineIds)} />
        <button
          className="text-black text-sm my-2 max-w-xl leading-none underline flex items-center justify-center"
          type="submit"
        >
          Remove
        </button>
      </fetcher.Form>
    );
  }
  
  function IconRemove() {
    return (
      <svg
        fill="transparent"
        stroke="currentColor"
        viewBox="0 0 20 20"
        className="w-5 h-5"
      >
        <title>Remove</title>
        <path
          d="M4 6H16"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M5.5 6L6 17H14L14.5 6"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 6L8 5C8 4 8.75 3 10 3C11.25 3 12 4 12 5V6"
          strokeWidth="1.25"
        />
      </svg>
    );
  }
  