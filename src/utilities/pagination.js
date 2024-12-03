export const pagination = ({page = 1 , size = 2}) => {
    if(page < 1) page = 1
    if(size < 1) size = 2

     const limit = size;
     const skip = (page - 1) * size // page = 3 ,size = 2 ,limit = 2 ,skip = 4 => هيجبلي تالت اتنين

     return {limit, skip}
}