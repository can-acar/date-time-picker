// @flow

import * as React from 'react';
import {forwardRef, useCallback, useRef, useState} from 'react';
import cx from "classnames";
import {Dropdown} from "react-bootstrap";
import DateInput from "./date-input";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import Container from "./container";

type propsType = {
    className?: string,
    id?: string,
    name?: string,
    locale?: string,
    columns?: number,
    format?: string,
    specialDays?: Array<{
        day: number,
        month: number,
        memo: string,
    }>,

    onChange?: Function,
    onBlur?: Function,
}


const DateRangePicker = forwardRef<propsType>((props: propsType, ref) => {

    const dropdownRef = useRef(ref)

    const [date, changeDate] = useState()
    const {
        placeholder,
        label,
        id,
        name,
        format = 'DD-MM-YYYY',
        locale = 'tr',
        clearable = false,
        disabled = false,
        onChange = (date) => {
        },
        onBlur = (date) => {
        },
        'aria-labelledby': ariaLabel,
    } = props

    const onHandleChangeDate = useCallback((date) => {
        changeDate(date)
        onChange(date)
        onBlur()
    }, [changeDate, onChange, onBlur])

    return <div ref={ref}
                className={cx('position-relative', props.className)}>
        <Dropdown ref={dropdownRef}>
            <Dropdown.Toggle as={DateInput}
                             id={id}
                             name={name}
                             label={label}
                             aria-label={ariaLabel}
                             placeholder={placeholder}
                             date={date}
                             format={props.format}>
                Seç
            </Dropdown.Toggle>
            <DropdownMenu>
                <Container specialDays={props.specialDays}
                           columns={props.columns}
                           locale={locale}
                           onChange={onHandleChangeDate}
                           format={format}
                />
            </DropdownMenu>
        </Dropdown>
    </div>;
});

export default DateRangePicker;
