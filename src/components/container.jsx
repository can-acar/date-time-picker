// @flow

import * as React from 'react';
import {forwardRef, useCallback, useEffect, useRef, useState} from 'react';
import cx from 'classnames';
import moment from "moment";
import Picker from "./picker";

type propsType = {
    className?: string,
    id?: string,
    name?: string,
    locale?: string,
    columns?: number,
    format?: string,
    column?: number,
    specialDays?: Array<{
        day: number,
        month: number,
        memo: string,
    }>,

    onChange?: Function,
    onBlur?: Function,
}

const Container = forwardRef<propsType>((props: propsType, ref) => {
    const firstPicker = useRef(null)
    const secondPicker = useRef(null)

    const {
        locale = "tr",
        format,
        columns = 1,
        range = true,
        onChange = (e) => {
        },
    } = props;

    const [selected, setSelectRange] = useState({
        start: [],
        end: [],
        middle: []
    })


    const style = {
        "card": true,
        "card-xxl-stretch": true,
        "mb-xl-0": true,
        "p-0": true,
        "border-0": true,
        "w-300px": columns === 1,
        "min-w-600px": columns > 1,
    }

    const onHandleFirstDayChange = useCallback((date) => {

        if (selected.start.length === 0) {
            setSelectRange({
                start: [date],
                end: [],
                middle: []
            })
        }

        if (selected.start.length > 0 && selected.end.length === 0) {
            setSelectRange(x => ({

                start: [...x.start],
                end: [date],
                middle: [...x.middle]

            }))
        }

        if (selected.start.length > 0 && selected.end.length > 0) {
            setSelectRange(x => ({
                start: [date],
                end: [],
                middle: []
            }))
        }

        if (date.diff(moment(selected.start[0])) < 0) {
            setSelectRange(x => ({
                start: [date],
                end: [],
                middle: []
            }))
        }


    }, [setSelectRange, format, range, selected])

    const onHandleSecondDayChange = useCallback((date) => {

        if (range) {
            setSelectRange(d => ({
                start: [...d.start],
                end: [date],
                middle: []
            }))
        } else {
            setSelectRange(d => ({
                start: [...d.start],
                end: [date],
                middle: []
            }))
        }
    }, [setSelectRange, format, range, selected])

    const onBeginRangeDateSelect = useCallback((date) => {


        let days = [];
        let current = moment(selected.start[0]).startOf('day')
        let end = moment(date).startOf('day')

        while (current.add(1, 'days').diff(end) < 0) {

            days.push(current.clone())
        }

        setSelectRange(d => ({
            start: [...d.start],
            end: [...d.end],
            middle: [...days]
        }))

    }, [setSelectRange, range, selected])

    useEffect(() => {
        if (selected.start.length > 0 && selected.end.length > 0) {
            onChange(selected)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected.start && selected.end])

    return <div ref={ref}
                className={cx(style)}>
        <div className="card-body border-0 px-2 py-1">
            <div className="d-flex flex-stack justify-content-between">
                <Picker range={selected}
                        specialDays={props.specialDays}
                        onChange={onHandleFirstDayChange}
                        onRangeDate={onBeginRangeDateSelect}
                        pos={'first'}
                        locale={locale}
                        format={format}
                        ref={firstPicker}/>

                {columns > 1 && <Picker range={selected}
                                        specialDays={props.specialDays}
                                        onChange={onHandleFirstDayChange}
                                        onRangeDate={onBeginRangeDateSelect}
                                        pos={'second'}
                                        locale={locale}
                                        ref={secondPicker}/>}

            </div>
        </div>
    </div>
});

export default Container;
