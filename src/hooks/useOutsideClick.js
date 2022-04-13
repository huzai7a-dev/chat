import React, {useEffect} from 'react';

export const useOutsideAlerter = (ref, handleClick = () => {}) => {
    useEffect(() => {
        const handleClickOutside = e => {
            if (ref.current && !ref.current.contains(e.target)) {
                return handleClick(e);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [handleClick, ref]);
}