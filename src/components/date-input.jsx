// @flow

import * as React from 'react';
import {useCallback, useState} from 'react';
import cx from "classnames";

const DateInput = React.forwardRef((props: {
    onClick: Function,
    label: string,
    id: string,
    name: string,
    format: string,
    date: {
        start: Array<string>,
        end: Array<string>
    }
}, ref) => { // eslint-disable-line

    const [position, setPosition: void] = useState({
        current: undefined,
        focused: false
    })

    const handleClick = useCallback((e) => {
        e.preventDefault() && e.stopPropagation()
        props.onClick(e)
    }, [props])

    const handleFocus = useCallback((e) => {
        e.preventDefault() && e.stopPropagation()
        let inputFocused = e.target.name || e.target.id
        e.target.style.cursor = 'pointer'
        setPosition({})
        setPosition({current: inputFocused, focused: true})

    }, [setPosition]);

    const handleBlur = useCallback((e) => {
        e.stopPropagation() && e.preventDefault();

        let inputFocused = e.target.name || e.target.id;

        setPosition({current: inputFocused, focused: false});

    }, [setPosition]);

    const displayDate = (date) => {
        let start = date?.start[0].format(props.format);
        let end = date?.end[0].format(props.format);

        return date && `${start}-${end}`;
    }

    return <div ref={ref}
                className={cx('date-input', {'date-input-focused': position.focused})}>
        <div
            className="form-control form-control-solid mb-lg-0 p-1 text-hover-inverse-secondary border border-gray-500 bg-hover-secondary"
            onBlur={handleBlur}
            onFocus={handleFocus}
            onClick={handleClick}>
            <div className="d-flex flex-stack justify-content-around">
                <span
                    className="text-hover-inverse-primary bg-hover-primary rounded w-100 p-1 text-center">{props.date?.start[0].format(props.format) || 'First date'}</span>
                <span className="">~</span>
                <span
                    className="text-hover-inverse-primary bg-hover-primary rounded w-100 p-1 text-center">{props.date?.end[0].format(props.format) || 'Last date'}</span>
            </div>
        </div>

    </div>


});

export default DateInput
