import {Link, useLocation, useSearchParams, useTransition} from '@remix-run/react';
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle';

export default function ProductOptions({options, selectedVariant}) {
  // pathname and search will be used to build option URLs
  const {pathname, search} = useLocation();
  const [currentSearchParams, setSearchParams] = useSearchParams({});
  const transition = useTransition();
  const [index, setIndex] = useState(0);

  const paramsWithDefaults = (() => {
    const defaultParams = new URLSearchParams(currentSearchParams);

    if(!selectedVariant) {
        return defaultParams;
    }

    for(const {name, value} of selectedVariant.selectedOptions) {
        if(!currentSearchParams.has(name)) {
            defaultParams.set(name, value);
        }
    }

    return defaultParams;
  })();

  const searchParams = transition.location
    ? new URLSearchParams(transition.location.search)
    : paramsWithDefaults;
  
  
  return (
    <div className="grid gap-4">
      {/* Each option will show a label and option value <Links> */}
      {options.map((option) => {
        if (!option.values.length) {
          return;
        }

        // get the currently selected option value
        const currentOptionVal = searchParams.get(option.name);
        return (
          <div
            key={option.name}
            className="gap-y-2 border-[1px] border-[#000000] text-md w-fit-content"
          >
            <Dropdown>
              <Dropdown.Toggle className="p-1 cursor-pointer" as="div">
                {currentOptionVal}
              </Dropdown.Toggle>

              <Dropdown.Menu className="non-rounded border-[#000000] border-[1px] p-1 w-fit-content">
                {option.values.map((value) => {
                  const linkParams = new URLSearchParams(searchParams);
                  const isSelected = currentOptionVal === value;
                  linkParams.set(option.name, value);
                  return (
                    <Dropdown.Item as="div" key={value} className="p-0 relativ w-fit-content hover:bg-unset">
                      <Link
                        to={`${pathname}?${linkParams.toString()}`}
                        preventScrollReset
                        replace
                        className={`leading-none cursor-pointer transition-all duration-200 w-fit-content relative hover:bg-hover hover:col-unset`}
                      >
                        {value}
                      </Link>
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
            
          </div>
        );
      })}
    </div>
  );
}
