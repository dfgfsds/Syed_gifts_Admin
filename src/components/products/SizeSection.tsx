import { useFieldArray } from "react-hook-form";
import Input from "../Input";
import Button from "../Button";
import { Plus, X } from "lucide-react";

export default function SizeSection({ control, register, varietyIndex }:any){
    const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
        control,
        name: `varieties.${varietyIndex}.sizes`
      });
    return(
        <>
          <div className="space-y-2">
      {sizeFields?.map((size, sizeIndex) => (
        <div key={size.id} className="flex gap-2 items-end">
          <Input
            label="Size"
            {...register(`varieties.${varietyIndex}.sizes.${sizeIndex}.product_size`)}
          />
          <Input
            label="Size Price"
            {...register(`varieties.${varietyIndex}.sizes.${sizeIndex}.product_size_price`)}
          />
          <button type="button"  className="mb-2 text-gray-400 hover:text-gray-500" onClick={() => removeSize(sizeIndex)}>  <X className="h-5 w-5" /></button>
        </div>
      ))}
      <Button type="button" onClick={() => appendSize({})}>
        <Plus className="w-4 h-4" /> Add Size
      </Button>
    </div>
        </>
    )
}