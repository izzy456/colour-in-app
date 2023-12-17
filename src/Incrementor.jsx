export default function Incrementor({valueName, value, handler, min, max}) {
    return (
        <label class="form-control w-20">
            <div class="label">
            <span class="label-text">{valueName}:</span>
            </div>
            <input class="input input-bordered" type="number" max={max} min={min} step="1" value={value} onChange={(e) => {
                handler(valueName, e.target.value)
            }}/>
        </label>
    )
}
