def twoSum(nums, target):
    # Dictionary to store the number and its index
    num_to_index = {}
    
    for i, num in enumerate(nums):
        complement = target - num  # Calculate the complement
        if complement in num_to_index:
            # If complement is found, return the indices
            return [num_to_index[complement], i]
        # Store the number and its index in the dictionary
        num_to_index[num] = i
    
    return []  # Return an empty list if no solution is found


if __name__ == "__main__":
    # Input: size of array
    n = int(input())
    
    # Input: array elements
    arr = list(map(int, input().split()))
    
    # Input: target sum
    target = int(input())
    
    # Call the twoSum function
    result = twoSum(arr, target)
    
    # Output the result indices
    for index in result:
        print(index)
