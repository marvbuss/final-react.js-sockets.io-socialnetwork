import { useEffect, useState } from "react";

export function HooksDemo() {
    const [search, setSearch] = useState();
    const cohorts = ["Onion", "Rue"];

    useEffect(() => {
        let abort = false;
        fetch(`/countries?search=${search}`)
            .then((res) => res.json())
            .then((data) => {
                if (!abort) {
                    console.log(data);
                }
            });
        return () => (abort = true);
    }, [search]);

    return (
        <>
            <h1>Hello Onion</h1>
            {cohorts.map((cohort) => {
                <h2>{cohort}</h2>;
            })}
            <input onChange={(e) => setSearch(e.target.value)} />
        </>
    );
}
